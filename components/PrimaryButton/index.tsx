import { MouseEventHandler, ReactNode } from "react";
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  children?: ReactNode,
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled? : boolean;
}

const PrimaryButton = ({ className, children, onClick, disabled }:PrimaryButtonProps)=>{
  return (
    <button disabled={disabled} onClick={onClick} className={`${styles.primary_button} ${className}`}>{children}</button>
  );
}

export default PrimaryButton;