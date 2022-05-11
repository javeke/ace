import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationResponse, Organization } from "../../../../common/types";
import organizations from '../../../../dataUtils/organizations.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApplicationResponse>){
  
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
  
      if(response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
          data: [],
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: "Interal Server Error",
          error: "An Error Occurred"
        });
      }

      if(response.status === StatusCodes.NOT_MODIFIED) {
        console.log(response);
        return res.status(StatusCodes.NOT_MODIFIED).json({ 
          data: [],
          code: StatusCodes.NOT_MODIFIED,
          msg: "Interal Server Error"
        });
      }
  
      const data = await response.json();
  
      return res.status(StatusCodes.OK).json({
        data,
        code: StatusCodes.OK,
        msg: "Organizations Retrieved" 
      });
    }
    catch(error) {
      console.log(error);
      return res.status(StatusCodes.CONFLICT).json({ 
        data: [],
        code: StatusCodes.CONFLICT,
        msg: "Server Error",
        error: "Request Not Sent"
      });
    }
  }
  else if (req.method === "GET"){
    const data: Organization[] = organizations;

    const result: ApplicationResponse  = {
      data,
      msg:"Successful",
      code:200
    };

    const errorResponse: ApplicationResponse = {
      data:[],
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