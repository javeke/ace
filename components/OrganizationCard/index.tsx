import styles from './OrganizationCard.module.css';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { Organization } from '../../common/types';
import Link from 'next/link';

interface OrganizationCardProps {
  organization: Organization,
  onDelete: (data: Organization)=>void
}

const OrganizationCard = ({ organization, onDelete }: OrganizationCardProps)=>{

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <div>
          <Link href={`/dashboard/${organization.organizationId}`}>
            <a className={styles.card_title_link}>
              <h3 className={styles.card_title}>{organization.name}</h3>
            </a>
          </Link>
        </div>
        <div className={styles.card_header_actions}>
          <span>
            <Link href={`/dashboard/${organization.organizationId}?action=edit`}>
              <a>
                <FiEdit />
              </a>
            </Link>
          </span>
          <span onClick={()=>onDelete(organization)}>
            <RiDeleteBin6Line />
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