import Head from "next/head";
import { ApplicationResponse } from "../../common/types";
import Card from "../../components/Card";
import styles from "../../styles/Dashboard.module.css";
import { IoMdAdd } from 'react-icons/io';
import { StatusCodes } from "http-status-codes";
import Link from "next/link";

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

    if(response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
      return {
        props: {
          serverData: { 
            data: [],
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: "Interal Server Error",
            error: "An Error Occurred"
          }
        }
      }
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
        serverData: { 
          data: [],
          code: StatusCodes.CONFLICT,
          msg: "Server Error",
          error: "Request Not Sent"
        }
      }
    }
  }
}


type DashboardProps = {
  serverData: ApplicationResponse
}

const Dashboard = ({ serverData }: DashboardProps)=>{

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
          serverData.data.length > 0 ? (
            <div className={styles.card_container}>
              {
                serverData.data.map((organization)=>(
                  <Card key={organization.organizationId} title={organization.name} bodyText={organization.description} />
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