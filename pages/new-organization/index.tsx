import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import PrimaryButton from "../../components/PrimaryButton";
import Topbar from "../../components/Topbar";
import styles from '../../styles/NewOrganization.module.css';

const NewOrganization = ()=>{

  const firstField = useRef<HTMLInputElement>(null);
  const addform = useRef<HTMLFormElement>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [organizationDescription, setorganizationDescription] = useState("");

  const router = useRouter();

  useEffect(()=>{
    firstField.current?.focus();
  }, []);

  const handleClick = () => {
    addform.current?.requestSubmit();
  }

  const handleSubmit = async (e:any)=>{
    e.preventDefault();
    

    fetch("/api/v1/organization", {
      method: "POST",
      body: JSON.stringify({
        name: organizationName,
        description: organizationDescription
      })
    })
    .then(res=>res.json())
    .then(()=>{
      router.push('/dashboard');
    })
    .catch(()=>{
      alert("Could not make request");
    });
  }

  return (
    <>
      <Head>
        <title>New Organization</title>
        <meta name="description" content="This is to add a new organization to the Ace Platfrom" />
      </Head>
      <div className="container">
        <Topbar title="New Organization" >
          <PrimaryButton className="spaced_button"onClick={handleClick}>
            <span>Save <AiOutlineFileAdd /></span>
          </PrimaryButton>
        </Topbar>

        <div className={styles.add_organization}>
          <form ref={addform} onSubmit={handleSubmit} className={styles.add_organization_form}>
            <div className={styles.add_organization_form_item}>
              <label htmlFor="organization-name">Name</label>
              <input ref={firstField} id="organization-name" type="text" placeholder="Organization name" value={organizationName} onChange={((e)=>setOrganizationName(e.target.value))} minLength={3} maxLength={255} required/>
            </div>
            <div className={styles.add_organization_form_item}>
              <label htmlFor="organization-description">Description</label>
              <textarea id="organization-description" placeholder="What does your origanization do?" value={organizationDescription} onChange={((e)=>setorganizationDescription(e.target.value))} required minLength={10} />
            </div>
          </form>
          <div className={styles.add_organization_flatImage}>
            <img src="/working_late.svg" alt="Add Post" />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewOrganization;