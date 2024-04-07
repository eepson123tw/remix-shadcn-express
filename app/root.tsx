import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import i18next from "~/i18next.server";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return json({ locale, ENV: { LOCAL_PATH: process.env.LOCAL_PATH } });
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "index",
};

function Loading() {
  return (
    <div className="p-2 absolute bg-gray-600 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[200px] h-[50px] rounded-lg shadow-lg flex items-center justify-center">
      <svg
        className="animate-spin h-5 w-5 mr-3 bg-white"
        viewBox="0 0 24 24"
      ></svg>
      Loading...
    </div>
  );
}

function LangSelect() {
  const { i18n } = useTranslation();
  const languages = ["zh-TW", "en"];

  return (
    <Select
      value={i18n.language}
      onValueChange={(value) => {
        i18n.changeLanguage(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={i18n.language} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Lang</SelectLabel>
          {languages &&
            languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function Root() {
  // Get the locale from the loader
  const { locale, ENV } = useLoaderData<typeof loader>();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const inRoot = !location.pathname.includes("todo");
  const computedPage = () => `${inRoot ? "bg-white p-4 rounded" : ""} w-[85%] `;
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-r from-cyan-200 to-blue-700 flex items-center flex-col h-full lg:pb-0 pb-6">
        <h1 className="text-xl mb-2 top-5 p-2">
          {t("greeting")}
          {t("user")}
        </h1>
        <div className="mb-5">
          <LangSelect />
        </div>
        {navigation.state !== "idle" ? (
          <Loading></Loading>
        ) : (
          <div className={computedPage()}>
            <Outlet />
          </div>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: ENV.LOCAL_PATH,
            })}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
