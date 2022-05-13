import styles from '../../styles/Card.module.css';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';

interface CardProps {
  title: string;
  subtitle?: string;
  bodyText: string;
}

const Card = ({title, subtitle, bodyText}: CardProps)=>{

  // TODO: complete this callback to remove organization
  const handleDelete = ()=>{
    fetch("/api/v1/organization", {
      method: "DELETE"
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <div>
          <h3 className={styles.card_title}>{title}</h3>
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
        <small className={styles.card_subtitle}>{subtitle}</small>
      </div>
      <div className={styles.card_content}>
        <p className={styles.card_content_body}>{bodyText}</p>
      </div>
    </div>
  );
}

export default Card;