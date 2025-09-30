import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

import ClassSegmentsFileField from "@/components/form/ClassSegmentsFileField";
import EmailField from "@/components/form/EmailField";
import ErrorSummary from "@/components/form/ErrorSummary";
import PasswordField from "@/components/form/PasswordField";
import TextField from "@/components/form/TextField";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    EmailField,
    PasswordField,
    TextField,
    ClassSegmentsFileField,
  },
  formComponents: {
    ErrorSummary,
  },
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
