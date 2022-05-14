import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationApiResponse, ErrorDataResponse, HTTP_SUCCESS_UPPER_CODE, Organization, OrganizationDataResponse } from "../../../../common/types";
import organizations from '../../../../dataUtils/organizations.json';
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationApiResponse>){
  
  const apiEndpoint = process.env.API_ENDPOINT!;
  
  if(req.method === "POST"){  
    console.log("Request to add organization");
    
    const requestBody = JSON.parse(req.body);
    
    try {
      const response = await fetch(apiEndpoint, {
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
        return  res.status(StatusCodes.NO_CONTENT).json({
          data: [],
          code: StatusCodes.NO_CONTENT,
          msg:"No Organizations Available"
        });
      }

      if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
        const err = errorHandler(response);
        return res.status(err.code).json(err);
      }
  
      const data = await response.json();
  
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
    const data: Organization[] = organizations;

    const result: OrganizationDataResponse  = {
      data,
      msg:"Successful",
      code:200
    };

    const errorResponse: ErrorDataResponse = {
      data:null,
      msg:"An Error Occured",
      code:400,
      error:"Bad Request"
    }
    
    const error = false;
    if(!error){
      res.status(200).json(result);
    }
    else{
      res.status(400).json(errorResponse);
    }
  }
  else {
    return res.status(StatusCodes.NOT_FOUND).json({
      data:[],
      msg:"Does Not Exist",
      code: StatusCodes.NOT_FOUND,
      error:"Method Does Not Exist"
    });
  }
  
}