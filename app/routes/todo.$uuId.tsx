import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// existing imports

export const loader = async ({ params }) => {
  console.log(params);
  // const contact = await getContact(params.contactId);
  // return json({ contact });
  return json({ params });
};

export default function ToDo() {
  const { params } = useLoaderData<typeof loader>();
  console.log(params);
  // existing code
  return <h1>{params.uuId}</h1>;
}

// existing code
