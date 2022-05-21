import { FormEvent, useRef, useState } from "react";
import { Organization } from "../../common/types";
import styles from './EditOrganization.module.css';

interface EditOrganizationProps {
  organization: Organization; 
  onEdit: (organization: Organization)=>Promise<void>;
  onCancel : ()=>void;
}

export default function EditOrganization( {organization, onCancel, onEdit} : EditOrganizationProps) {

  const [organizationData, setOrganizationData] = useState<Organization>(organization);
  const editOrganizationForm = useRef<HTMLFormElement>(null);

  const setOrganizationName = (name: string)=>{
    setOrganizationData({
      ...organizationData,
      name
    });
  }

  const setorganizationDescription = (description: string)=>{
    setOrganizationData({
      ...organizationData,
      description
    });
  }

  const handleClick = () => {
    editOrganizationForm.current?.requestSubmit();
  }

  const handleSubmit = (e:FormEvent)=>{
    e.preventDefault();

    // organizationData.description.match(/[A-z0-9]{10,}/) 

    onEdit(organization)
  }

  return (
    <div className={styles.edit_organization}>
      <form onSubmit={handleSubmit} className={styles.edit_organization_form} ref={editOrganizationForm}>
        <div className={styles.edit_organization_form_item}>
          <label htmlFor="organization-name">Name</label>
          <input id="organization-name" type="text" placeholder="Organization name" value={organizationData.name} onChange={((e)=>setOrganizationName(e.target.value))} minLength={3} maxLength={255} pattern="[A-z0-9]{3,}" required/>
        </div>
        <div className={styles.edit_organization_form_item}>
          <label htmlFor="organization-description">Description</label>
          <textarea id="organization-description" placeholder="What does your origanization do?" value={organizationData.description} onChange={((e)=>setorganizationDescription(e.target.value))} required minLength={10} />
        </div>
      </form>
      <div className={styles.edit_organization_actions}>
        <button className={styles.edit_organization_actions_cancel} onClick={onCancel}>Cancel</button>
        <button className={styles.edit_organization_actions_cta} onClick={handleClick}>Update</button>
      </div>
    </div>
  );
}