import { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

export default function Header(props: { user: User }) {
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to=".">App Name</Link>
      </h1>
      <p>{props.user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
