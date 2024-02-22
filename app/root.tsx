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
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
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
        <div className="w-[50%] bg-white p-2 mt-[10%]">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
