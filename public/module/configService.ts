import { HttpClient } from "@/lib/HttpClient";
const API_PREFIX = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const http = new HttpClient(API_PREFIX);

export const fetchConfig = async () => {
  const response = await http.get<any>(`${API_PREFIX}/config`);
  return response;
};

export const fetchConfigBySearchParams = async (searchParam: string) => {
  const response = await http.get<any>(`${API_PREFIX}/config/${searchParam}`);
  return response;
};

export const fetchTopKeyConfig = async () => {
  const response = await http.get<any>(`${API_PREFIX}/config/topkey`);
  return response;
};

export const deleteConfigKey = async (key: string) => {
  const response = await http.delete(`${API_PREFIX}/config/delete/${key}`);
  return response;
};
