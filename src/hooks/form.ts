import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import TextField from "../components/form/TextField.tsx";
import ErrorSummary from "../components/form/ErrorSummary.tsx";
import EmailField from "../components/form/EmailField.tsx";
import PasswordField from "../components/form/PasswordField.tsx";
import ClassSegmentsFileField from "../components/form/ClassSegmentsFileField.tsx";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    EmailField,
    PasswordField,
    TextField,
    ClassDetailsFileField: ClassSegmentsFileField,
  },
  formComponents: {
    ErrorSummary,
  },
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
