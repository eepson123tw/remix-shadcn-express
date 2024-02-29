import { cssBundleHref } from "@remix-run/css-bundle";
import styles from "./tailwind.css";

import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useLocation,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const location = useLocation();
  const inRoot = !location.pathname.includes("todo");
  const computedPage = () => `${inRoot ? "bg-white p-2" : ""} w-[50%] mt-[10%]`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-r from-cyan-500 to-blue-500 h-[100svh] flex  items-center flex-col">
        <h1 className="text-4xl absolute top-5">Welcome to Remix</h1>
        <div className={computedPage()}>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <p>No Way!</p>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
