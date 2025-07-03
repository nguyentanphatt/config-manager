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

export const fetchConfigDataByParentKey = async (parentKey: string) => {
  const response = await http.get(`${API_PREFIX}/config/parent/${parentKey}`);
  return response;
};

export const updateConfigData = async (key: string, data: any) => {
  const response = await http.put(`${API_PREFIX}/config/update/${key}`, {
    value: data,
  });
  return response;
};

export const addConfigData = async (key: string, value: any) => {
  const response = await http.post(`${API_PREFIX}/config/add`, {
    key,
    value,
  });
  return response;
};

export const fetchBackup = async () => {
  const response = await http.get<{ filename: string; time: string }[]>(
    `${API_PREFIX}/config/backup`
  );
  return response;
};

export const fetchBackupDetail = async (filename: string) => {
  const response = await http.get(`${API_PREFIX}/config/backup/${filename}`);
  return response;
};

export const rollback = async (filename: string) => {
  const response = await http.post(
    `${API_PREFIX}/config/backup/rollback/${filename}`
  );
  return response;
};
