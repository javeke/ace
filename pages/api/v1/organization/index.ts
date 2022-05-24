import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiOrganizationsResponse, HTTP_SUCCESS_UPPER_CODE } from "../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiOrganizationsResponse>){
  
  const apiEndpoint = process.env.API_ENDPOINT!;
  
  if(req.method === "POST"){  
    console.log("Request to add organization");
    
    const requestBody = JSON.parse(req.body);
    
    try {
      const response = await fetch(`${apiEndpoint}/organizations`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          name: requestBody?.name,
          description: requestBody?.description
        })
      });

      if(response.status === StatusCodes.NO_CONTENT){
        console.log("No Content Response. No organization was added.");
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
      console.log(`Response Code: ${response.status}. Organizations Retreived.`);
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Organizations Retrieved" 
      });
    }
    catch(error) {
      return res.status(serverErrorResponse.code).json(serverErrorResponse);
    }
  }
  else if (req.method === "GET"){
    console.log("Request to get organizations");
    try {
      const response = await fetch(`${apiEndpoint}/organizations`);

      if(response.status === StatusCodes.NO_CONTENT){
        console.log("No Content Response. No organization exists.");
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
      console.log(`Response Code: ${response.status}. Organizations Retreived.`);
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Organizations Retrieved" 
      });
    }
    catch(error) {
      return res.status(serverErrorResponse.code).json(serverErrorResponse);
   }
  }
  else {
    console.log(`Request Method does not exist.`);
    return res.status(StatusCodes.NOT_FOUND).json({
      data:[],
      msg:"Does Not Exist",
      code: StatusCodes.NOT_FOUND,
      error:"Method Does Not Exist"
    });
  }
}