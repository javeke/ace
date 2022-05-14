export const HTTP_SUCCESS_UPPER_CODE = 299;

export interface Organization {
  organizationId: string,
  name: string,
  description: string;
}

export interface ApplicationResponse {
  msg: string;
  code : number;
  error?: string;
}

export interface OrganizationDataResponse extends ApplicationResponse {
  data: Organization[]
}

export interface ErrorDataResponse extends ApplicationResponse {
  data: null
}

export type ApplicationApiResponse = OrganizationDataResponse | ErrorDataResponse;