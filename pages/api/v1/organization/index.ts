import { NextApiRequest, NextApiResponse } from "next";
import { ApplicationResponse, Organization } from "../../../../common/types";

export default function handler(req: NextApiRequest, res: NextApiResponse<ApplicationResponse>){

  const data: Organization[] = [
    {
      id:"some-id",
      name:"First Organization",
      description:"This organization specializes in medical grade devices for critical and non-critical care patients."
    },
    {
      id:"next-id",
      name:"Second Organization",
      description:"We provide one stop solutions for all your agricultural and e-farm solutions."
    }
  ];

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