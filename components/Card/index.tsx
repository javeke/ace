import styles from '../../styles/Card.module.css';

interface CardProps {
  title: string;
  subtitle?: string;
  bodyText: string;
}

const Card = ({title, subtitle, bodyText}: CardProps)=>{
  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.card_title}>{title}</h3>
        <small className={styles.card_subtitle}>{subtitle}</small>
      </div>
      <div className={styles.card_content}>
        <p className={styles.card_content_body}>{bodyText}</p>
      </div>
    </div>
  );
}

export default Card;