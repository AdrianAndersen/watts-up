import { CreateClassForm } from "@/components/CreateGroupClass";

export async function createNewGroupClass(
  data: CreateClassForm,
  accessToken: string,
) {
  const response = await fetch(
    `https://services.mywellness.com/${data.club}/Training/Facility/1969943e-fb6a-4378-95cf-54737a83d81d/CreateNewPhysicalActivity?_c=nb-NO`,
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
        name: data.className,
        whoCanUseIt: "OnlyTheAuthor",
        advancedProfileCategoryType: "Classes",
        target: "Duration",
        workload: "WattPerc",
      }),
    },
  );
  return await response.json();
}
