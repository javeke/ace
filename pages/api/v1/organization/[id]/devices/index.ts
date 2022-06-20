import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiDevicesResponse, HTTP_SUCCESS_UPPER_CODE } from "../../../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../../../utils/apiErrorHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiDevicesResponse>){

  const apiEndpoint = process.env.API_ENDPOINT!;
  const organizationId = req.query.id;
  const body = req.body;

  if(req.method === "POST") {
    console.log("Sending request to add new device to organization with id %s", organizationId);
    try {
      const response = await fetch(`${apiEndpoint}/organizations/${organizationId}/devices`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body
      });


      if(response.status === StatusCodes.NO_CONTENT){
        console.log("No Content Response. No device was added.");
        return  res.status(StatusCodes.NO_CONTENT).json({
          data: null,
          code: StatusCodes.NO_CONTENT,
          msg:"No Devices Available"
        });
      }

      if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
        console.log(`Error Response Code: ${response.status}`);
        const err = errorHandler(response);
        return res.status(err.code).json(err);
      }
  
      const data = await response.json();
      console.log(`Response Code: ${response.status}. Device Retrieved.`);
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Device Retrieved" 
      });
    } catch (error) {
      return res.status(serverErrorResponse.code).json(serverErrorResponse);
    }
  }
}