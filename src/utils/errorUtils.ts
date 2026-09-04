import { AxiosError } from "axios";

export const extractErrorMessage = (
  err: unknown,
  defaultMessage: string,
): string => {
  if (err instanceof AxiosError) {
    if (typeof err.response?.data === "string") {
      return err.response.data;
    }
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
  }
  return defaultMessage;
};
