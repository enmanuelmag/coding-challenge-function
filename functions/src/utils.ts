/* eslint-disable @typescript-eslint/no-explicit-any */
export const Response = (status: number, message: string, data: any) => ({
  status,
  message,
  data,
});
