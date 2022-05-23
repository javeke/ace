import Head from "next/head";
import { ApplicationApiOrganizationsResponse, HTTP_SUCCESS_UPPER_CODE, Organization, OrganizationsDataResponse } from "../../common/types";
import OrganizationCard from "../../components/OrganizationCard";
import styles from "../../styles/Dashboard.module.css";
import { IoMdAdd } from 'react-icons/io';
import { StatusCodes } from "http-status-codes";
import Link from "next/link";
import errorHandler, { serverErrorResponse } from "../../utils/apiErrorHandler";
import { ReactNode, useState } from "react";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import ConfirmDelete from "../../components/ConfirmDelete";
import Topbar from "../../components/Topbar";
import BaseError from "../../components/BaseError";
import PrimaryButton from "../../components/PrimaryButton";

export const getServerSideProps = async () => {
  
  const apiEndpoint = process.env.API_ENDPOINT!;

  try {  
    const response  = await fetch(`${apiEndpoint}/organizations`);

    if(response.status === StatusCodes.NO_CONTENT){
      return {
        props: {
          serverData: { 
            data: [],
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
          serverData : err
        }
      };
    }

    const data = await response.json();

    return {
      props : { 
        serverData : {
          data,
          code: StatusCodes.OK,
          msg:"Organizations Retrieved" 
        }
      }
    }
  }
  catch(error){
    return {
      props: {
        serverData: serverErrorResponse
      }
    }
  }
}


type DashboardProps = {
  serverData: ApplicationApiOrganizationsResponse
}

const Dashboard = ({ serverData }: DashboardProps)=>{

  const [organizations, setOrganizations] = useState<Organization[]>(serverData.data || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModal, setIsErrorModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("Modal");
  const [modalComponent, setModalComponent] = useState<ReactNode>(undefined);


  const shouldDelete = (organization: Organization)=>{
    setIsErrorModal(false);
    setModalTitle(`Delete ${organization.name}`);
    setModalComponent(<ConfirmDelete organization={organization} onDelete={handleDelete} onCancel={handleCancel} />);
    setIsModalOpen(true);
  }
  
    
  const handleDelete = async (organization: Organization)=>{
    setIsModalOpen(false);
    setIsLoading(true);
    try {
      const response  = await fetch(`/api/v1/organization/${organization.organizationId}`, {
        method: "DELETE"
      });

      if(response.status === StatusCodes.NOT_MODIFIED){
        alert(`Could not delete ${organization.name}`);
      }

      if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
        alert("A server error occurred");
      }

      if(response.status ===  StatusCodes.OK){
        alert(`Deleted ${organization.name}`);
        const newData: OrganizationsDataResponse = await response.json();
        setOrganizations(newData.data);
      }
    }
    catch(error){
      alert("No request was sent");
    }
    finally{
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const handleEdit = async (organization: Organization, updateOrganization:any) => {
    setIsModalOpen(false);
    setIsLoading(true);
    try {
      console.log(updateOrganization);
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
      }
    }
    catch(error){
      alert("No request was sent");
    }
    finally{
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }

  if (serverData.error) {
    return (
      <BaseError />
    );
  }

  return (
    <>
      <Head>
        <title>Ace Dashboard</title>
        <meta name="description" content="This is the organization dashboard for Ace" />
      </Head>
      <div className="container">
        <Topbar title="Organization Dashboard" >
          <PrimaryButton className="spaced_button">
            <Link href="/new-organization">
              <a><IoMdAdd />Create</a>
            </Link>
          </PrimaryButton>
        </Topbar>

        {
          ((organizations.length > 0)) ? (
            <div className={styles.card_container}>
              {
                organizations.map((organization)=>(
                  <OrganizationCard key={organization.organizationId} organization={organization} onDelete={shouldDelete} />
                ))
              }
            </div>
          ) : (
            <div className="center-text">
              <p>{serverData.msg}</p>
            </div>
          )
        }
        { isLoading && <Loading isFullscreen onClick={()=> setIsLoading(false)}/> }
        { isModalOpen && <Modal isError={isErrorModal} title={modalTitle} onClose={()=> setIsModalOpen(false)}>{modalComponent}</Modal> }
      </div>
    </>
  );
}

export default Dashboard;