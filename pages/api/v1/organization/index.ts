import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationResponse, Organization } from "../../../../common/types";
import organizations from '../../../../dataUtils/organizations.json';

export default function handler(req: NextApiRequest, res: NextApiResponse<ApplicationResponse>){

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