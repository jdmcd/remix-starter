import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";

import { getUserId } from "~/auth/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId !== undefined) {
    return redirect("/dashboard");
  }

  return null;
};

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Link
            to="/join"
            className="flex items-center justify-center rounded-md border border-transparent bg-blue-50 px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-100 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
