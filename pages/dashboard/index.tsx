import Head from "next/head";
import { ApplicationResponse } from "../../common/types";
import Card from "../../components/Card";
import styles from "../../styles/Dashboard.module.css";
import organizations from '../../dataUtils/organizations.json';

export const getServerSideProps = async () => {
  
  const serverData = {
    data: organizations
  }

  return {
    props : { serverData }
  }
}


type DashboardProps = {
  serverData: ApplicationResponse
}

const Dashboard = ({ serverData }: DashboardProps)=>{

  if (serverData.error) {
    return <p>An Error Occured</p>;
  }

  return (
    <>
      <Head>
        <title>Ace Dashboard</title>
        <meta name="description" content="This is the organization dashboard for Ace" />
      </Head>
      <div className="container">
        <div className={styles.card_container}>
          {
            serverData.data.map((organization)=>(
              <Card key={organization.id} title={organization.name} bodyText={organization.description} />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default Dashboard;