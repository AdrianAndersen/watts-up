import { z } from "zod";

import { ClassSegment } from "@/components/form/ClassSegmentsFileField";

const ErrorResponse = z.object({
  errors: z.array(
    z.object({
      details: z.string(),
      errorMessage: z.string(),
      field: z.string(),
      message: z.string(),
      type: z.string(),
    }),
  ),
});

const LoginResponse = z.object({
  data: z.object({
    facilities: z.array(
      z.object({
        url: z.string(),
      }),
    ),
  }),
  token: z.string(),
});

const CreatePhysicalActivityResponse = z.object({
  data: z.object({
    physicalActivityId: z.string(),
  }),
});

const UpdatePhysicalActivityResponse = z.object({
  data: z.object({
    updated: z.boolean(),
  }),
});

interface PhysicalActivityData {
  stepGroups: {
    name: string;
    position: number;
    stepStart: number;
    stepEnd: number;
  }[];
  steps: {
    extData: { countdown: string };
    notes: string;
    position: number;
    userInstructions: string;
    stepData: {
      name: string;
      um: string;
      value: number;
    }[];
  }[];
}
function mergeSegments(segments: ClassSegment[]): ClassSegment[] {
  const mergedSegments: ClassSegment[] = [];
  for (const segment of segments) {
    const prevSegment = mergedSegments.at(-1);
    if (
      prevSegment &&
      prevSegment.notes === segment.notes &&
      prevSegment.rpm === segment.rpm &&
      prevSegment.startWattPercentage === segment.startWattPercentage &&
      prevSegment.endWattPercentage === segment.endWattPercentage
    ) {
      prevSegment.durationInSeconds += segment.durationInSeconds;
      continue;
    }
    mergedSegments.push(segment);
  }
  return mergedSegments;
}

function convertToPhysicalActivityData(
  segments: ClassSegment[],
): PhysicalActivityData {
  const stepGroups: PhysicalActivityData["stepGroups"] = [];
  const steps: PhysicalActivityData["steps"] = [];
  const mergedSegments = mergeSegments(segments);
  for (const [index, segment] of mergedSegments.entries()) {
    const prevStepGroup = stepGroups.at(-1);
    if (prevStepGroup && prevStepGroup.name === segment.blockLabel) {
      prevStepGroup.stepEnd += 1;
    } else {
      stepGroups.push({
        name: segment.blockLabel,
        position: stepGroups.length + 1,
        stepStart: index + 1,
        stepEnd: index + 1,
      });
    }
    steps.push({
      extData: { countdown: "false" },
      notes: segment.notes,
      position: index,
      userInstructions: "",
      stepData: [
        {
          name: "Duration",
          um: "Sec",
          value: segment.durationInSeconds,
        },
        {
          name: "WattPerc",
          um: "WattPerc",
          value: segment.startWattPercentage,
        },
        {
          name: "WattPerc",
          um: "WattPerc",
          value: segment.endWattPercentage,
        },
        {
          name: "Rpm",
          um: "Rpm",
          value: segment.rpm,
        },
      ],
    });
  }
  return { stepGroups, steps };
}

const MyWellness = {
  async login({ username, password }: { username: string; password: string }) {
    try {
      const response = await fetch(
        "https://services.mywellness.com/Application/69295ED5-A53C-434B-8518-F2E0B5F05B28/Login?_c=nb-No",
        {
          method: "POST",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-MWAPPS-CLIENT": "professional",
          }),
          body: JSON.stringify({ username, password }),
        },
      );

      const responseData = await response.json().catch(() => ({}));

      const parsedOk = LoginResponse.safeParse(responseData);
      if (parsedOk.success) {
        const url = parsedOk.data.data.facilities.at(0)?.url;
        if (url) return { token: parsedOk.data.token, facilityUrl: url };
        return { errorMessage: "facilityUrl mangler fra login-respons" };
      }

      const parsedErr = ErrorResponse.safeParse(responseData);
      if (parsedErr.success) {
        const msg =
          parsedErr.data.errors.map((e) => e.errorMessage).join("; ") ||
          "Ukjent feil under login";
        return { errorMessage: msg };
      }

      return {
        errorMessage: "Noe gikk veldig galt: Ukjent response fra login-API",
      };
    } catch {
      return {
        errorMessage: "Noe gikk galt under innlogging. Vennligst prøv igjen",
      };
    }
  },

  async createNewGroupClass({
    facilityUrl,
    accessToken,
    className,
  }: {
    facilityUrl: string;
    accessToken: string;
    className: string;
  }) {
    try {
      const response = await fetch(
        `https://services.mywellness.com/${facilityUrl}/Training/Facility/1969943e-fb6a-4378-95cf-54737a83d81d/CreateNewPhysicalActivity?_c=nb-NO`,
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            canCreateType: "CardioAdvancedProfile",
            context: "ClassProfile",
            createOnEquipmentId: "53a39729-76df-4506-b0d4-eca20b4c7293",
            name: className,
            whoCanUseIt: "OnlyTheAuthor",
            advancedProfileCategoryType: "Classes",
            target: "Duration",
            workload: "WattPerc",
          }),
        },
      );
      const responseData = await response.json().catch(() => ({}));

      const parsedOk = CreatePhysicalActivityResponse.safeParse(responseData);
      if (parsedOk.success) {
        return { activityId: parsedOk.data.data.physicalActivityId };
      }

      const parsedErr = ErrorResponse.safeParse(responseData);
      if (parsedErr.success) {
        const msg =
          parsedErr.data.errors.map((e) => e.errorMessage).join("; ") ||
          "Ukjent feil under opprettelse av time";
        return { errorMessage: msg };
      }

      return {
        errorMessage:
          "Noe gikk veldig galt: Ukjent response fra CreateNewPhysicalActivity-API",
      };
    } catch {
      return {
        errorMessage:
          "Noe gikk galt under opprettelse av time. Vennligst prøv igjen",
      };
    }
  },

  async updateGroupClass({
    facilityUrl,
    accessToken,
    activityId,
    segments,
  }: {
    facilityUrl: string;
    accessToken: string;
    activityId: string;
    segments: ClassSegment[];
  }) {
    try {
      const { steps, stepGroups } = convertToPhysicalActivityData(segments);
      const response = await fetch(
        `https://services.mywellness.com/${facilityUrl}/Training/PhysicalActivity/${activityId}/UpdatePhysicalActivity?_c=nb-NO`,
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            physicalActivityData: {
              steps,
              stepGroups,
            },
          }),
        },
      );
      const responseData = await response.json().catch(() => ({}));

      const parsedOk = UpdatePhysicalActivityResponse.safeParse(responseData);
      if (parsedOk.success) {
        return { success: parsedOk.data.data.updated };
      }

      const parsedErr = ErrorResponse.safeParse(responseData);
      if (parsedErr.success) {
        const msg =
          parsedErr.data.errors.map((e) => e.errorMessage).join("; ") ||
          "Ukjent feil under oppdatering av time";
        return { errorMessage: msg };
      }

      return {
        errorMessage:
          "Noe gikk veldig galt: Ukjent response fra UpdatePhysicalActivity-API",
      };
    } catch {
      return {
        errorMessage:
          "Noe gikk galt under oppdatering av time. Vennligst prøv igjen",
      };
    }
  },
};

export default MyWellness;
