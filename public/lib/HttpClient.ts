import axios, { AxiosHeaders, AxiosRequestHeaders, AxiosInstance } from "axios";
import { encryptRSA } from "./encryptRSA";

export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? `Bearer ${token}` : null;
  } catch {
    return null;
  }
};

const prepareEncryptedPayload = async (data: any): Promise<any> => {
  if (!data) return undefined;
  const encrypted = await encryptRSA(data);
  return { encrypted };
};

const withAuth = (headers: AxiosHeaders = new AxiosHeaders()): AxiosHeaders => {
  const token = getToken();
  if (token) headers.set("Authorization", token);
  return headers;
};

interface RequestConfig {
  headers?: AxiosRequestHeaders;
  params?: object;
  data?: object;
  apiName?: string;
  skipEncrypt?: boolean;
}

export class HttpClient {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL, withCredentials: true });
  }

  private async wrap<T>(promise: Promise<any>): Promise<T | null> {
    try {
      const res = await promise;
      return res?.data ?? null;
    } catch (err: any) {
      console.log("HTTP Error:", err);
      return null;
    }
  }

  get = async <T = any>(url: string, cfg: RequestConfig = {}) => {
    let encryptedParams = cfg.params;
    if (cfg.params) {
      const encrypted = await encryptRSA(cfg.params);
      encryptedParams = { encrypted };
    }
    return this.wrap<T>(
      this.axios.get(url, {
        headers: withAuth(new AxiosHeaders(cfg.headers)),
        ...cfg,
        params: encryptedParams,
      })
    );
  };

  post = async <T = any>(
    url: string,
    data: any = null,
    cfg: RequestConfig = {}
  ) => {
    const payload = cfg.skipEncrypt
      ? data
      : await prepareEncryptedPayload(data);
    return this.wrap<T>(
      this.axios.post(url, payload, {
        headers: withAuth(new AxiosHeaders(cfg.headers)),
        ...cfg,
      })
    );
  };

  put = async <T = any>(url: string, data: any, cfg: RequestConfig = {}) => {
    const encryptedData = await prepareEncryptedPayload(data);
    return this.wrap<T>(
      this.axios.put(url, encryptedData, {
        headers: withAuth(new AxiosHeaders(cfg.headers)),
        ...cfg,
      })
    );
  };

  patch = async <T = any>(url: string, data: any, cfg: RequestConfig = {}) => {
    const encryptedData = await prepareEncryptedPayload(data);
    return this.wrap<T>(
      this.axios.patch(url, encryptedData, {
        headers: withAuth(new AxiosHeaders(cfg.headers)),
        ...cfg,
      })
    );
  };

  delete = async <T = any>(url: string, cfg: RequestConfig = {}) => {
    let encryptedParams = cfg.params;
    if (cfg.params) {
      const encrypted = await encryptRSA(cfg.params);
      encryptedParams = { encrypted };
    }
    return this.wrap<T>(
      this.axios.delete(url, {
        headers: withAuth(new AxiosHeaders(cfg.headers)),
        ...cfg,
        params: encryptedParams,
      })
    );
  };
}
