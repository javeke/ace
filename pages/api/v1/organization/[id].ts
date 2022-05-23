import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiResponse, HTTP_SUCCESS_UPPER_CODE } from "../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";

// TODO: Complete this api call to the javeke ws to remove organization from DB

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiResponse>){

  const apiEndpoint = process.env.API_ENDPOINT!;
  const organizationId = req.query.id;

  if(req.method === "DELETE") {
    console.log("Sending request to delete organization with id %s", organizationId);
    try {
      const response = await fetch(`${apiEndpoint}/organizations/${organizationId}`, {
        method:"DELETE"
      });

      if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
        console.log(`Error Response Code: ${response.status}`);
        const err = errorHandler(response);
        return res.status(err.code).json(err);
      }

      const data = await response.json();
      console.log(`Response Code: ${response.status}. Organization Deleted.`);
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Organizations Retrieved" 
      });
    }
    catch(error){
      return res.status(serverErrorResponse.code).json(serverErrorResponse);
    }
  }
  else if(req.method === "PUT") { 
    // TODO: Complete this implementation
    console.log("Sending request to update organization with id %s", organizationId);
    try {
      const response = await fetch(`${apiEndpoint}/organizations/${organizationId}`, {
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: req.body
      });
      
      if(response.status === StatusCodes.NO_CONTENT){
        console.log("No Content Response. No organization was updated.");
        return  res.status(StatusCodes.NO_CONTENT).json({
          data: [],
          code: StatusCodes.NO_CONTENT,
          msg:"No Organizations Available"
        });
      }

      if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
        console.log(`Error Response Code: ${response.status}`);
        const err = errorHandler(response);
        return res.status(err.code).json(err);
      }

      const data = await response.json();
      console.log(`Response Code: ${response.status}. Organization Updated.`);
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Organization Updated" 
      });
    }
    catch(error){
      console.log(error);
      return res.status(serverErrorResponse.code).json(serverErrorResponse);
    }
  }
}