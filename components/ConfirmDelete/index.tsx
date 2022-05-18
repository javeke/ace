import { Organization } from '../../common/types';
import styles from './ConfirmDelete.module.css';

interface ConfirmDeleteProps {
  organization: Organization;
  onDelete: (organization: Organization)=>Promise<void>,
  onCancel: ()=>void
}

export default function ConfirmDelete({ organization, onDelete, onCancel }:ConfirmDeleteProps){
  return (
    <div className={styles.confirm_delete}>
      <div className={styles.confirm_delete_header}>
        <p>Are you sure you want to delete <strong>{organization.name}</strong>?</p>
      </div>
      <div className={styles.confirm_delete_actions}>
        <button className={styles.confirm_delete_actions_cancel} onClick={onCancel}>Cancel</button>
        <button className={styles.confirm_delete_actions_cta} onClick={()=> onDelete(organization)}>Delete</button>
      </div>
    </div>
  );
}