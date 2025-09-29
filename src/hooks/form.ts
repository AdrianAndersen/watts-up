import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, withFieldGroup, useFieldContext, useFormContext };
