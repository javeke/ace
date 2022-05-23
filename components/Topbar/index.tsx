import { ReactNode } from "react";
import styles from './Topbar.module.css';

interface TopbarProps {
  title: string;
  children?: ReactNode;
}

export default function Topbar({ children, title }: TopbarProps){
  return (
    <div className={styles.topbar}>
      <h2 className={styles.topbar_title}>{title}</h2>
      <div className={styles.topbar_actions}>
        {children}
      </div>
    </div>
  );
}