import { HttpClient } from "@/lib/HttpClient";
const API_PREFIX = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const http = new HttpClient(API_PREFIX);

export const login = async (username: string, password: string) => {
  const response = await http.post(
    `${API_PREFIX}/login`,
    {
      username,
      password,
    },
    { skipEncrypt: true }
  );
  return response;
};
