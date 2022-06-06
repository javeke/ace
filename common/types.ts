import { Moment } from "moment-timezone";

export const HTTP_SUCCESS_UPPER_CODE = 299;

export interface DeviceData {
  paramName: string;
  paramValue: string;
  createdAt: Moment;
}

export interface Device {
  id: string;
  name:  string;
  enabled: boolean;
  healthStatus: string;
  dataPoints: DeviceData[] | null;
  type: string;
}

export interface SocketDataMessage {
  data: DeviceData;
  message: string;
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
  data: Organization[];
}

export interface OrganizationDataResponse extends ApplicationResponse {
  data: Organization;
}

export interface DeviceDataResponse extends ApplicationResponse {
  data: Device;
}

export interface ErrorDataResponse extends ApplicationResponse {
  data: null;
}

export type ApplicationApiOrganizationsResponse = OrganizationsDataResponse | ErrorDataResponse;

export type ApplicationApiOrganizationResponse = OrganizationDataResponse | ErrorDataResponse;

export type ApplicationApiDeviceResponse = DeviceDataResponse | ErrorDataResponse;