export type UrlParams = {
  [key: string]: string | number | boolean;
};

export interface ApiResponseStatus {
  valid: boolean;
  message?: string;
}
