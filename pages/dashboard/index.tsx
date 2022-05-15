import Head from "next/head";
import { ApplicationApiResponse, HTTP_SUCCESS_UPPER_CODE, Organization, OrganizationDataResponse } from "../../common/types";
import Card from "../../components/Card";
import styles from "../../styles/Dashboard.module.css";
import { IoMdAdd } from 'react-icons/io';
import { StatusCodes } from "http-status-codes";
import Link from "next/link";
import errorHandler, { serverErrorResponse } from "../../utils/apiErrorHandler";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  
  const apiEndpoint = process.env.API_ENDPOINT!;

  try {  
    const response  = await fetch(apiEndpoint);

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
  serverData: ApplicationApiResponse
}

const Dashboard = ({ serverData }: DashboardProps)=>{

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(()=>{
    if(serverData.code === StatusCodes.OK && serverData.data){
      setOrganizations(serverData.data);
    }
  },[]);

  const onDelete = (newData: Organization[])=>{
    setOrganizations(newData);
  }

  if (serverData.error) {
    return (
      <div className="container center-text">
        <p>An Error Occured</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Ace Dashboard</title>
        <meta name="description" content="This is the organization dashboard for Ace" />
      </Head>
      <div className="container">

        <div className="topbar">
          <h2 className="topbar_title">Organization Dashboard</h2>
          <button className="topbar_add_action">
            <Link href="/new-organization">
              <a>Create <IoMdAdd /></a>
            </Link>
          </button>
        </div>

        {
          ((organizations.length > 0)) ? (
            <div className={styles.card_container}>
              {
                organizations.map((organization)=>(
                  <Card key={organization.organizationId} organization={organization} ondelete={onDelete} />
                ))
              }
            </div>
          ) : (
            <div className="center-text">
              <p>{serverData.msg}</p>
            </div>
          )
        }
      </div>
    </>
  );
}

export default Dashboard;