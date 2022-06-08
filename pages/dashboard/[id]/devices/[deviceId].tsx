import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useState } from "react";
import { ApplicationApiDeviceResponse, Device, DeviceData, HTTP_SUCCESS_UPPER_CODE, Organization } from "../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import moment from "moment-timezone";

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
        organizationId : params.id,
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

const WS_API = process.env.NEXT_PUBLIC_ACE_WS_API_ENDPOINT;

interface DevicePageProps {
  organizationId?: string;
  staticData: ApplicationApiDeviceResponse
}

const DevicesPage = ({ organizationId, staticData }: DevicePageProps)=>{

  const [device, setDevice] = useState<Device>();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>();
  const [someText, setSomeText] = useState<string>("");
  const [stompClient] = useState<CompatClient>(
    Stomp.over(()=> new SockJS(WS_API || ""))
  );
  const [socketSubscription, setSocketSubscription] = useState<StompSubscription>();
  
  useEffect(()=>{

    if(staticData.data){
      setDevice(staticData.data);
    }

    stompClient.debug = ()=>{};

    stompClient.onDisconnect = () => {  
      console.log(`Disconnected from channel for ${device?.id}`);
      setIsSocketConnected(false);
    }

    stompClient.onConnect = () => {
      console.log(`Connected to receiving channel for ${device?.id}`);

      const subscription = stompClient.subscribe(`/deviceData/organizations/${organizationId}/devices/${device?.id}`, (frame)=>{
        const response = JSON.parse(frame?.body); 
        console.log(response);
      });

      setSocketSubscription(subscription);

      setIsSocketConnected(true);
    }
    stompClient.activate();
    
    return () => {
      socketSubscription?.unsubscribe();
      stompClient.deactivate();
    }
  }, []);


  const handleSubmit = () => {

    const body: DeviceData = {
      paramName: "Temparature",
      paramValue: someText || "21",
      createdAt: moment.tz()
    };

    stompClient.publish({
      destination: `/ace/data/organizations/${organizationId}/devices/${device?.id}`,
      body: JSON.stringify({
        data: body,
        message:"New Update for this channel"
      })
    });
  }

  return (
    <>
      <Head>
        <title>{device?.name}</title>
        <meta name="description" content={"About this device"} />
      </Head>
      <main className="container">
        {device?.name}

        <label htmlFor="temperature">Temperature</label>
        <input id="temperature" name="temperature" type="text" value={someText} onChange={(e)=>setSomeText(e.target.value)} />
        <button onClick={handleSubmit} disabled={!isSocketConnected}>Submit</button>
      </main>
    </>
  );
}

export default DevicesPage;