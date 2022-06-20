import { FormEvent, useState } from "react";
import styles from "./AddingDevice.module.css";

interface AddingDeviceProps {
  onSubmit: (name: string, type: string) => Promise<void>;
}

const AddingDevice = ({ onSubmit }: AddingDeviceProps) => {

  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("default");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(name, type);
  }

  return (
    <div className={styles.adding_device}>
      <form onSubmit={handleSubmit} className={styles.adding_device_form}>
        <div className={styles.adding_device_form_field}>
          <label htmlFor="device-name">Name</label>
          <input id="device-name" name="device-name" placeholder="Device name"
            value={name} onChange={e => setName(e.target.value)} required/>
        </div>
        <div className={styles.adding_device_form_field}>
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} name="device-type" id="device-type">
            <option value="default" disabled>Choose a type</option>
            <option value="medical">Medical</option>
            <option value="agricultural">Agricultural</option>
            <option value="home-enhancement">Home Enhancement</option>
          </select>
        </div>
        <div className={styles.adding_device_submit}>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddingDevice;