import { z } from "zod";

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
    return await response.json();
  },
};

export default MyWellness;
