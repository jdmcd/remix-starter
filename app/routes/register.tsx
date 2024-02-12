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
import { Field, ErrorList } from "~/components/ui/forms";
import { RegisterFormSchema } from "~/forms/RegisterFormSchema";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect } from "~/utils/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: RegisterFormSchema.superRefine(async (data, ctx) => {
      const existingUser = await getUserByEmail(data.email);
      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this email",
        });
        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply({ hideFields: ["password"] }) },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const { email, password, firstName, lastName } = submission.value;
  const redirectTo = safeRedirect(submission.value.redirectTo, "/");
  const user = await createUser({ email, password, firstName, lastName });

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Register() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "register-form",
    constraint: getZodConstraint(RegisterFormSchema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RegisterFormSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="POST" {...getFormProps(form)} className="space-y-6">
          <Field
            labelProps={{ children: "First Name" }}
            inputProps={getInputProps(fields.firstName, { type: "text" })}
            errors={fields.firstName.errors}
          />

          <Field
            labelProps={{ children: "Last Name" }}
            inputProps={getInputProps(fields.lastName, { type: "text" })}
            errors={fields.lastName.errors}
          />

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
            Create Account
          </button>
          <ErrorList errors={form.errors} id={form.errorId} />
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              className="text-blue-500 underline"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log In
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
