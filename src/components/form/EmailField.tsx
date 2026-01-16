import { TextInput } from "@mantine/core";
import type { TextInputProps } from "@mantine/core";
import validator from "validator";

import { useFieldContext } from "@/hooks/form";

export function emailFieldValidator(value: string) {
  if (!value) return "Du må fylle inn e-post";

  if (!validator.isEmail(value)) return "Du må fylle inn en gyldig e-post";

  return null;
}

export default function EmailField(props: TextInputProps) {
  const field = useFieldContext<string>();

  return (
    <TextInput
      required
      label={"E-post"}
      placeholder={"jonas.abrahamsen@unoxteam.com"}
      autoComplete={"email"}
      inputMode={"email"}
      type={"email"}
      {...props}
      value={field.state.value}
      onChange={(event) => field.handleChange(event.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors.join(", ")}
    />
  );
}
