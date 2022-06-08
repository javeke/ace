import { MouseEventHandler, ReactNode } from "react";
import styles from './SecondaryButton.module.css';

interface SecondaryButtonProps {
  children?: ReactNode,
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const SecondaryButton = ({ className, children, onClick }:SecondaryButtonProps)=>{
  return (
    <button onClick={onClick} className={`${styles.secondary_button} ${className}`}>{children}</button>
  );
}

export default SecondaryButton;