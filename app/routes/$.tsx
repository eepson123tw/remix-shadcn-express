import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "@remix-run/react";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

// 404 Page
export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data} ~</p>
        <button
          className="p-2 bg-black text-white"
          onClick={() => navigate("/")}
        >
          index
        </button>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
