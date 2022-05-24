import { MouseEventHandler, ReactNode } from "react";
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  children?: ReactNode,
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const PrimaryButton = ({ className, children, onClick }:PrimaryButtonProps)=>{
  return (
    <button onClick={onClick} className={`${styles.primary_button} ${className}`}>{children}</button>
  );
}

export default PrimaryButton;