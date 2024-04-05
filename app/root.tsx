import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
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
import type { LoaderFunctionArgs } from "@remix-run/node";
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
  return <div>Loading...</div>;
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
  const location = useLocation();
  const inRoot = !location.pathname.includes("todo");
  const computedPage = () => `${inRoot ? "bg-white p-4 rounded" : ""} w-[85%] `;
  const { locale, ENV } = useLoaderData<typeof loader>();
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

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
      <body className="bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center flex-col h-full">
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
