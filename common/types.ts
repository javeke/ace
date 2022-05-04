export interface Organization {
  id: string,
  name: string,
  description: string;
}

export type ApplicationResponse = {
  data: Organization[];
  msg: string;
  code : number;
  error?: string;
}