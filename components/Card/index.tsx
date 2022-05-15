import styles from '../../styles/OrganizationCard.module.css';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { Organization, OrganizationDataResponse } from '../../common/types';
import { StatusCodes } from 'http-status-codes';

interface OrganizationCardProps {
  organization: Organization,
  ondelete: (data: Organization[])=>void
}

const OrganizationCard = ({ organization, ondelete }: OrganizationCardProps)=>{

  // TODO: complete this callback to remove organization
  const handleDelete = async ()=>{
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
        const newData: OrganizationDataResponse = await response.json();
        ondelete(newData.data);
      }
    }
    catch(error){
      alert("No request was sent");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <div>
          <h3 className={styles.card_title}>{organization.name}</h3>
        </div>
        <div className={styles.card_header_actions}>
          <span>
            <FiEdit />
          </span>
          <span>
            <RiDeleteBin6Line onClick={handleDelete} />
          </span>
        </div>
      </div>
      <div>
        {/* <small className={styles.card_subtitle}>{subtitle}</small> */}
      </div>
      <div className={styles.card_content}>
        <p className={styles.card_content_body}>{organization.description}</p>
      </div>
    </div>
  );
}

export default OrganizationCard;