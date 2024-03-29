import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ApplicationApiDevicesResponse, ApplicationApiOrganizationResponse, HTTP_SUCCESS_UPPER_CODE, Organization } from "../../../common/types";
import BaseError from "../../../components/BaseError";
import EditOrganization from "../../../components/EditOrganization";
import PrimaryButton from "../../../components/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton";
import Topbar from "../../../components/Topbar";
import errorHandler, { serverErrorResponse } from "../../../utils/apiErrorHandler";
import styles from '../../../styles/OrganizationPage.module.css';
import Loading from "../../../components/Loading";
import { isEmptyObject } from "../../../utils";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import DeviceCard from "../../../components/DeviceCard";
import Modal from "../../../components/Modal";
import AddingDevice from "../../../components/AddingDevice";

interface StaticProps {
  params: { id: string };
}

export async function getServerSideProps({ params } : StaticProps) {
  const apiEndpoint = process.env.API_ENDPOINT!;

  if(params === null || params === undefined){
    return {
      props: { 
        staticData : {
          data: null,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: "Server Error"
        }
       }
    }
  }

  if(params.id === null || params.id === undefined){
    return {
      props: { 
        staticData : {
          data: null,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: "Server Error"
        }
       }
    }
  }

  try {
    const response = await fetch(`${apiEndpoint}/organizations/${params.id}`);

    if(response.status === StatusCodes.NO_CONTENT){
      return {
        props: { 
            staticData: { 
              data: null,
              code: StatusCodes.NO_CONTENT,
              msg:"No Organizations Available"
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

    const data: Organization = await response.json();
    return {
      props : { 
        staticData : {
          data,
          code: StatusCodes.OK,
          msg:"Organization Retrieved" 
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
interface OrganizationPageProps {
  staticData: ApplicationApiOrganizationResponse
}

const OrganizationPage = ( { staticData }: OrganizationPageProps ) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmitRef = useRef<HTMLFormElement>(null);
  const [organization, setOrganization] = useState<Organization | null>(staticData.data);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>();
  const [socketClient, setSocketConnection] = useState<CompatClient>();
  const [modalTitle, setModalTitle] = useState<string>("Modal");
  const [modalComponent, setModalComponent] = useState<ReactNode>();

  const stompClient = Stomp.over(()=> new SockJS(WS_API || ""));
  
  useEffect(()=>{  

    stompClient.debug = ()=>{};

    stompClient.onDisconnect = () => {  
      console.log(`Disconnected from all channels for ${organization?.organizationId}`);
    }

    stompClient.onConnect = () => {
      console.log(`Connected to receiving channel for ${organization?.organizationId}`);
      setSocketConnection(stompClient);
    }
    
    stompClient.activate();
    
    return () => {
      stompClient?.deactivate();
    }
  }, []);


  if(staticData.data === null){
    return <BaseError />
  }

  const handleEdit = async (organization: Organization, updateOrganization:any) => {
    const NO_CHANGES_MESSAGE = "No changes were made.";

    setIsLoading(true);
    try {    
      if(isEmptyObject(updateOrganization)) {
        throw new Error(NO_CHANGES_MESSAGE);
      }

      const response  = await fetch(`/api/v1/organization/${organization.organizationId}`, {
        method: "PUT",
        body: JSON.stringify(updateOrganization)
      });

      if(response.status === StatusCodes.NOT_MODIFIED){
        alert(`Could not update ${organization.name}`);
      }

      if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
        alert("A server error occurred");
      }

      if(response.status ===  StatusCodes.OK){
        alert(`Updated ${organization.name}`);
        const data: ApplicationApiOrganizationResponse = await response.json();
        setOrganization(data.data!);
      }
    }
    catch(error: any){
      if(error.message === NO_CHANGES_MESSAGE){
        alert(error.message);
      }
      else{
        alert("No request was sent.");
      }
    }
    finally{
      setIsEditing(false);
      setIsLoading(false);
    }
  }

  const handleClick = ()=>{
    setIsEditing(true);
  }

  const handleCancel = ()=>{
    setIsEditing(false);
  }

  const handleSave = ()=>{
    handleSubmitRef.current?.requestSubmit();
  }

  const handleAddDeviceRequest = async (deviceName: string, deviceType: string) => {
    const NOT_ADDED_MESSAGE = "No device added.";

    setIsLoading(true);
    try {  
      const response  = await fetch(`/api/v1/organization/${organization?.organizationId}/devices`, {
        method: "POST",
        body: JSON.stringify({
          name: deviceName,
          type: deviceType
        })
      });

      if(response.status === StatusCodes.NOT_MODIFIED){
        alert(`Could not create device.`);
      }

      if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
        alert("A server error occurred");
      }

      if(response.status ===  StatusCodes.OK){
        alert(`Device ${deviceName} created.`);
        const data: ApplicationApiDevicesResponse = await response.json();

        const updateOrganization = {
          ...organization!,
          devices: data.data
        };

        setOrganization(updateOrganization);
      }
    }
    catch(error: any){
      if(error.message === NOT_ADDED_MESSAGE){
        alert(error.message);
      }
      else{
        alert("No request was sent.");
      }
    }
    finally{
      setIsAddingDevice(false);
      setIsLoading(false);

    }
  }

  const handleAddDevice = () => {
    setModalTitle("Add Device");
    setModalComponent(<AddingDevice onSubmit={handleAddDeviceRequest} />);
    setIsAddingDevice(true);
  }

  return (
    <>
      <Head>
        <title>{organization?.name}</title>
        <meta name="description" content={organization?.description} />
      </Head>
      <div className="container">
        <Topbar title={organization?.name || ""} >
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
              <PrimaryButton className="spaced_button" onClick={handleClick}>
                <span>Edit</span>
              </PrimaryButton>
            )
          }
        </Topbar>
        {
          isEditing ? (
            <div className={styles.edit_organization_page}>
              <EditOrganization organization={organization!} onEdit={handleEdit} formRef={handleSubmitRef} />
              <div className={styles.edit_organization_page_placeholder}>
                <img src="/review.svg" alt="Review" />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.organization_description}>
                {organization?.description}
              </div>
              <section className={styles.devices_section}>
                <div className={styles.devices_section_header}>
                  <h3>Devices</h3>
                  <PrimaryButton className={styles.devices_section_add_device_btn} onClick={handleAddDevice}> 
                    <span>Add device</span>
                  </PrimaryButton>
                </div>
                <div className={styles.devices_card_container}>
                  {
                    organization?.devices?.length ? (
                      organization.devices.map((device)=>{
                        return (
                          <DeviceCard key={device.id} organizationId={organization.organizationId} device={device} stompClient={socketClient} />
                        )
                      })
                    )
                    : (
                      <p>No devices yet</p>
                    )
                  }
                </div>
              </section>
            </>
          )
        }
        { isAddingDevice && <Modal isError={false} title={modalTitle} onClose={()=> setIsAddingDevice(false)}>{modalComponent}</Modal> }
        { isLoading && <Loading isFullscreen onClick={()=> setIsLoading(false)}/> }
      </div>
    </>
  );
}

export default OrganizationPage;