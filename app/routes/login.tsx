import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { z } from "zod";

import { createUserSession, getUserId } from "~/auth/session.server";
import { CheckboxField, ErrorList, Field } from "~/components/ui/forms";
import { LoginFormSchema } from "~/forms/LoginFormSchema";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: (intent) =>
      LoginFormSchema.transform(async (data, ctx) => {
        if (intent !== null) return { ...data, session: null };

        const session = await verifyLogin(data.email, data.password);
        if (!session) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid username or password",
          });
          return z.NEVER;
        }

        return { ...data, session };
      }),
    async: true,
  });

  if (submission.status !== "success" || !submission.value.session) {
    return json(
      { result: submission.reply({ hideFields: ["password"] }) },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  return createUserSession({
    redirectTo: safeRedirect(submission.value.redirectTo, "/"),
    remember: submission.value.remember ?? false,
    request,
    userId: submission.value.session?.id ?? -1,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "login-form",
    constraint: getZodConstraint(LoginFormSchema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="POST" {...getFormProps(form)} className="space-y-6">
          <Field
            labelProps={{ children: "Email" }}
            inputProps={getInputProps(fields.email, { type: "email" })}
            errors={fields.email.errors}
          />

          <Field
            labelProps={{ children: "Password" }}
            inputProps={getInputProps(fields.password, { type: "password" })}
            errors={fields.password.errors}
          />

          <input {...getInputProps(fields.redirectTo, { type: "hidden" })} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <ErrorList errors={form.errors} id={form.errorId} />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckboxField
                labelProps={{
                  htmlFor: fields.remember.id,
                  children: "Remember me",
                }}
                buttonProps={getInputProps(fields.remember, {
                  type: "checkbox",
                })}
                errors={fields.remember.errors}
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
