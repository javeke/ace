import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiDeviceResponse } from "../../../../../../common/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiDeviceResponse>){

  const apiEndpoint = process.env.API_ENDPOINT!;
  const id = req.query.id;
  const deviceId = req.query.deviceId;
  const body = req.body;

  if(req.method === "GET") {
    const respose = await fetch(`${apiEndpoint}/organizations/${id}/devices`, {
      body
    });
  }
}