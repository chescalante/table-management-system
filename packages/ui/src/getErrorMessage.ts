import axios from "axios";
import { z } from "zod";

export default function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  } else if (error instanceof z.ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
  } else if (error instanceof Error) {
    return error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  } else if (typeof error === "string") {
    return error;
  } else {
    return "Something went wrong";
  }
}
