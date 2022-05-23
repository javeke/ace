import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { ApplicationApiOrganizationResponse, HTTP_SUCCESS_UPPER_CODE, Organization } from "../../../common/types";
import Topbar from "../../../components/Topbar";
import errorHandler, { serverErrorResponse } from "../../../utils/apiErrorHandler";

export async function getStaticPaths() {
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

    const paths  = data.map(organization =>({
      params: {
        id: organization.organizationId
      }
    }));

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
  params?: { id: string };
}

export async function getStaticProps({ params } : StaticProps) {
  const apiEndpoint = process.env.API_ENDPOINT!;

  if(params === null || params === undefined){
    return {
      props: { organization: null }
    }
  }

  if(params.id === null || params.id === undefined){
    return {
      props: { organization: null }
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

interface OrganizationPageProps {
  staticData: ApplicationApiOrganizationResponse
}

const OrganizationPage = ( { staticData }: OrganizationPageProps ) => {

  const [organization, setOrganization] = useState<Organization | null>(staticData.data);

  return (
    <>
      <Head>
        <title>{organization?.name}</title>
        <meta name="description" content={organization?.description} />
      </Head>
      <div className="container">
        <Topbar title={organization?.name || ""} >
          <button className="topbar_primary_action">
            <Link href="/new-organization">
              <a><FiEdit /> Edit</a>
            </Link>
          </button>
        </Topbar>
        <div>
          {organization?.description}
        </div>
      </div>
    </>
  );
}

export default OrganizationPage;