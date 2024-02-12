import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/auth/session.server";
import stylesheet from "~/tailwind.css";

import { useToast } from "./components/toaster";
import { Toaster } from "./components/ui/sonner";
import { getEnv } from "./utils/env.server";
import { combineHeaders, getDomainUrl } from "./utils/misc";
import { Theme, getTheme } from "./utils/theme.server";
import { getToast } from "./utils/toast.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);

  return json(
    {
      user: await getUser(request),
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request),
        },
      },
      ENV: getEnv(),
      toast,
    },
    {
      headers: combineHeaders(toastHeaders),
    },
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "New App" : "Error | New App" },
    { name: "description", content: `Some Description Here` },
  ];
};

function Document({
  children,
  theme = "light",
  env = {},
}: {
  children: React.ReactNode;
  theme?: Theme;
  env?: Record<string, string>;
}) {
  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  useToast(data.toast);

  return (
    <Document
      theme={data.requestInfo.userPrefs.theme ?? "light"}
      env={data.ENV}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Toaster
        closeButton
        position="bottom-right"
        theme={data.requestInfo.userPrefs.theme ?? "system"}
      />
    </Document>
  );
}
