import Ajv, { JSONSchemaType } from "ajv";

export const ajv = new Ajv({ allErrors: true });

export type formData = {
  title: string;
  description: string;
  isCompleted?: boolean;
};

export const schema: JSONSchemaType<formData> = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    description: {
      type: "string",
      minLength: 1,
    },
    isCompleted: { type: "boolean", nullable: true },
  },
  required: ["title", "description"],
  additionalProperties: false,
};

const formValidate = ajv.compile(schema);

export default formValidate;
