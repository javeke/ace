import { ReactNode, useRef } from "react";
import styles from './Modal.module.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export interface ModalProps {
  title: string;
  isError?: boolean;
  onClose: ()=>void;
  children?: ReactNode;
}

export default function Modal({title, children, isError, onClose}: ModalProps){

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = ()=> {
    backdropRef.current?.classList.remove(styles.opening_backdrop);
    modalRef.current?.classList.remove(styles.opening_modal);
    modalRef.current?.classList.add(styles.closing_modal);
    backdropRef.current?.classList.add(styles.closing_backdrop);
    setTimeout(()=>{
      onClose();
    }, 500);
  }

  return (
    <div ref={backdropRef} className={`${styles.modal} ${styles.opening_backdrop}`}>
      <div ref={modalRef} className={`${styles.modal_container} ${styles.opening_modal}`}>
        <div className={`${styles.modal_header} ${isError ? styles.error :""}`}>
          <h3>{title}</h3>
          <IoIosCloseCircleOutline className={styles.modal_close} onClick={handleClose} />
        </div>
        <div className={styles.modal_content}>
          {children}
        </div>
      </div>
    </div>
  );
}