export interface Organization {
  organizationId: string,
  name: string,
  description: string;
}

export type ApplicationResponse = {
  data: Organization[];
  msg: string;
  code : number;
  error?: string;
}