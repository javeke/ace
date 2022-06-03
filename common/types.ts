export const HTTP_SUCCESS_UPPER_CODE = 299;

export interface Device {
  id: string;
  name:  string;
}

export interface Organization {
  organizationId: string,
  name: string,
  description: string;
  devices: Device[] | null
}

export interface ApplicationResponse {
  msg: string;
  code : number;
  error?: string;
}

export interface OrganizationsDataResponse extends ApplicationResponse {
  data: Organization[]
}

export interface OrganizationDataResponse extends ApplicationResponse {
  data: Organization
}

export interface ErrorDataResponse extends ApplicationResponse {
  data: null
}

export type ApplicationApiOrganizationsResponse = OrganizationsDataResponse | ErrorDataResponse;

export type ApplicationApiOrganizationResponse = OrganizationDataResponse | ErrorDataResponse;