import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiDeviceResponse } from "../../../../../../common/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiDeviceResponse>){

  const apiEndpoint = process.env.API_ENDPOINT!;
  console.log(req.query);

  
}