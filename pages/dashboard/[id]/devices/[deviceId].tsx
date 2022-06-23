import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useState } from "react";
import { ApplicationApiDeviceResponse, Device, DeviceData, HTTP_SUCCESS_UPPER_CODE, Organization } from "../../../../common/types";
import errorHandler, { serverErrorResponse } from "../../../../utils/apiErrorHandler";
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import moment, { Moment } from "moment-timezone";
import Topbar from "../../../../components/Topbar";
import PrimaryButton from "../../../../components/PrimaryButton";
import SecondaryButton from "../../../../components/SecondaryButton";
import styles from '../../../../styles/Devices.module.css';

interface StaticProps {
  params: { 
    id: string,
    deviceId: string;
  };
}


export async function getServerSideProps({ params } : StaticProps) {
  const apiEndpoint = process.env.API_ENDPOINT!;

  if(params === null || params === undefined){
    return {
      props: { 
        organizationId : "",
        staticData: {
          data: null,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg:"Server Error"
        }
       }
    }
  }

  if(params.id === null || params.id === undefined){
    return {
      props: { 
        organizationId : "",
        staticData: {
          data: null,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg:"Server Error"
        }
       }
    }
  }

  if(params.deviceId === null || params.deviceId === undefined){
    return {
      props: { 
        organizationId : params.id,
        staticData: {
          data: null,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg:"Server Error"
        }
       }
    }
  }

  try {
    const response = await fetch(`${apiEndpoint}/organizations/${params?.id}/devices/${params?.deviceId}`);
    if(response.status === StatusCodes.NO_CONTENT){
      return {
        props: { 
          organizationId : params?.id,
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
          organizationId : params?.id,
          staticData : err
        }
      };
    }

    const data: Device = await response.json();
    return {
      props : { 
        organizationId : params?.id,
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
        organizationId : params?.id,
        staticData: serverErrorResponse
      }
    }
  }
}

const WS_API = process.env.NEXT_PUBLIC_ACE_WS_API_ENDPOINT;

interface DevicePageProps {
  organizationId: string;
  staticData: ApplicationApiDeviceResponse
}

const DevicesPage = ( { organizationId, staticData }:DevicePageProps )=>{

  const [device, setDevice] = useState<Device | null>(staticData.data);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>();
  const [someText, setSomeText] = useState<string>("");
  const [socketClient, setSocketConnection] = useState<CompatClient>();
  const [socketSubscription, setSocketSubscription] = useState<StompSubscription>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(()=>{

    const stompClient = Stomp.over(()=> new SockJS(WS_API || ""));

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
      setSocketConnection(stompClient);
      setIsSocketConnected(true);
    }
    stompClient.activate();
    
    return () => {
      socketSubscription?.unsubscribe();
      stompClient.deactivate();
    }
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleSave = () => {
    setIsEditing(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const formatDate = (date: Moment) => moment(date).format("MMM d, YYYY @ hh:mm:ss")


  const handleSubmit = () => {

    const body: DeviceData = {
      paramName: "Temparature",
      paramValue: someText || "21",
      createdAt: moment.tz()
    };

    socketClient?.publish({
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
      <Topbar title={device?.name || ""} >
          {
            isEditing ? (
              <>
                <SecondaryButton className="spaced_button" onClick={handleCancel}>
                  <span>Cancel</span>
                </SecondaryButton>
                <PrimaryButton className="spaced_button" onClick={handleSave}>
                  <span>Save</span>
                </PrimaryButton>
              </>
            ): (
              <PrimaryButton className="spaced_button" onClick={handleEdit}>
                <span>Edit</span>
              </PrimaryButton>
            )
          }
        </Topbar>

        <div className={styles.device_send_data}>
          <div className={styles.device_send_data_field}>
            <input id="temperature" name="temperature" type="number" placeholder="Temperature"
              value={someText} onChange={(e)=>setSomeText(e.target.value)} />
          </div>
          <button className={styles.device_send_data_btn} onClick={handleSubmit} disabled={!isSocketConnected}>Submit</button>
        </div>

        <div className={styles.device_data_points}>
          {
            device?.dataPoints?.map((dataPoint, index)=>(
              <div className={styles.device_data_point} key={`${dataPoint.createdAt}-${index}`}>
                <div className={styles.device_data_point_params}>
                  <span>{dataPoint.paramName}:</span><strong>{dataPoint.paramValue}</strong>
                </div>
                <small className={styles.device_data_point_time}>{formatDate(dataPoint.createdAt)}</small>
              </div>
            ))
          }
        </div>
      </main>
    </>
  );
}

export default DevicesPage;