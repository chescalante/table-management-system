import { z } from "zod";

// NOTE: DO NOT destructure process.env

const env = {
  APP_URL: import.meta.env.VITE_API_URL,
};

const envSchema = z
  .object({
    APP_URL: z.string().url().optional().default("http://localhost:5000"),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
