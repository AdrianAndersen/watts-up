import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import TextField from "../components/form/TextField.tsx";
import ErrorSummary from "../components/form/ErrorSummary.tsx";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    ErrorSummary,
  },
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
