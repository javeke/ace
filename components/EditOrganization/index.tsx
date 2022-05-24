import { FormEvent, RefObject, useRef, useState } from "react";
import { Organization } from "../../common/types";
import styles from './EditOrganization.module.css';

interface EditOrganizationProps {
  organization: Organization; 
  onEdit: (organization: Organization, updateOrganization: any)=>Promise<void>;
  formRef?: RefObject<HTMLFormElement>;
}

export default function EditOrganization( {organization, onEdit, formRef} : EditOrganizationProps) {

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

  const handleSubmit = (e:FormEvent)=>{
    e.preventDefault();

    // organizationData.description.match(/[A-z0-9]{10,}/) 

    onEdit(organization, {
      "name": organization.name !== organizationData.name ? organizationData.name : undefined,
      "description": organization.description !== organizationData.description ? organizationData.description : undefined,
    });
  }

  return (
    <div className={styles.edit_organization}>
      <form onSubmit={handleSubmit} className={styles.edit_organization_form} ref={formRef}>
        <div className={styles.edit_organization_form_item}>
          <label htmlFor="organization-name">Name</label>
          <input id="organization-name" type="text" placeholder="Organization name" value={organizationData.name} onChange={((e)=>setOrganizationName(e.target.value))} minLength={3} maxLength={255} required/>
        </div>
        <div className={styles.edit_organization_form_item}>
          <label htmlFor="organization-description">Description</label>
          <textarea id="organization-description" placeholder="What does your organization do?" value={organizationData.description} onChange={((e)=>setorganizationDescription(e.target.value))} required minLength={10} />
        </div>
      </form>
    </div>
  );
}