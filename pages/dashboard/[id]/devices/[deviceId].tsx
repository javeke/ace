import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { ApplicationApiDeviceResponse, Device, HTTP_SUCCESS_UPPER_CODE, Organization } from "../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";

export async function getStaticPaths(){
  const apiEndpoint = process.env.API_ENDPOINT!;

  try {
    const response = await fetch(`${apiEndpoint}/organizations`);

    if(response.status === StatusCodes.NO_CONTENT){
      return {
        paths: [],
        fallback:  false
      }
    }

    if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
      throw new Error;
    }
      
    const data: Organization[] = await response.json();

    const paths  = data.map(organization =>{
      return organization.devices?.map((device)=>({
        params: {
          id: organization.organizationId,
          deviceId: device.id
        }
      }))
    }).flat();

    return {
      paths,
      fallback: "blocking"
    }

  } catch (error) {
    return {
      paths: [],
      fallback:  false
    }
  }
}

interface StaticProps {
  params?: { 
    id: string,
    deviceId: string;
  };
}


export async function getStaticProps({ params } : StaticProps) {
  const apiEndpoint = process.env.API_ENDPOINT!;

  if(params === null || params === undefined){
    return {
      props: { device: null }
    }
  }

  if(params.id === null || params.id === undefined){
    return {
      props: { device: null }
    }
  }

  if(params.deviceId === null || params.deviceId === undefined){
    return {
      props: { device: null }
    }
  }

  try {
    const response = await fetch(`${apiEndpoint}/organizations/${params.id}/devices/${params.deviceId}`);
    if(response.status === StatusCodes.NO_CONTENT){
      return {
        props: { 
            staticData: { 
            data: null,
            code: StatusCodes.NO_CONTENT,
            msg:"No Device Available"
          } 
        }
      }
    }

    if(!(response.status >= StatusCodes.OK && response.status<= HTTP_SUCCESS_UPPER_CODE)){
      const err = errorHandler(response);
      return {
        props :{
          staticData : err
        }
      };
    }

    const data: Device = await response.json();
    return {
      props : { 
        staticData : {
          data,
          code: StatusCodes.OK,
          msg:"Device Retrieved" 
        }
      }
    }

  } catch (error) {
    return {
      props: {
        staticData: serverErrorResponse
      }
    }
  }
}

interface DevicePageProps {
  staticData: ApplicationApiDeviceResponse
}

const DevicesPage = ({ staticData }: DevicePageProps)=>{

  const [device, setDevice] = useState<Device | null>(staticData.data);

  const router  = useRouter();
  return (
    <>
      <Head>
        <title>{device?.name}</title>
        <meta name="description" content={"About this device"} />
      </Head>
      <main className="container">
        {device?.name}
      </main>
    </>
  );
}

export default DevicesPage;