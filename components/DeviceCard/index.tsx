import { CompatClient, StompSubscription } from "@stomp/stompjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ControlMessage, Device, DeviceData, SocketControlMessage, SocketDataMessage } from "../../common/types";
import styles from "./DeviceCard.module.css";
import { BsCircleFill } from "react-icons/bs";


interface DeviceCardProps {
  organizationId: string;
  device: Device;
  stompClient: CompatClient | undefined
}

const DeviceCard = ({device, organizationId, stompClient}: DeviceCardProps) => {

  const [socketSubscription, setSocketSubscription] = useState<StompSubscription>();
  const [socketControlSubscription, setSocketControlSubscription] = useState<StompSubscription>();
  const [currentValue, setCurrentValue] = useState<DeviceData | undefined>();
  const [currentState, setCurrentState] = useState<boolean>();

  useEffect(()=>{
    setCurrentValue(device?.dataPoints?.at(-1));
    setCurrentState(device?.enabled);

    if(stompClient?.connected){
      const subscription = stompClient.subscribe(`/deviceData/organizations/${organizationId}/devices/${device?.id}`, (frame)=>{
        const response: SocketDataMessage = JSON.parse(frame?.body); 
        setCurrentValue(response.data);
      });

      const controlSub = stompClient.subscribe(`/controlData/organizations/${organizationId}/devices/${device?.id}`, (frame)=>{
        const response: SocketControlMessage = JSON.parse(frame?.body); 
        console.log(response);
        switch (response.message) {
          case ControlMessage.StateChange:
            setCurrentState(response.control.enabled);
            break;
        
          default:
            break;
        }
      });

      console.log(controlSub);

      setSocketSubscription(subscription);
      setSocketControlSubscription(controlSub);
    }
    return () => {
      socketSubscription?.unsubscribe();
      socketControlSubscription?.unsubscribe();
    }
  }, [stompClient]);

  const toggleDeviceState = () => {

    const body: SocketControlMessage = {
      control: {
        ...device,
        enabled: !currentState
      },
      message: ControlMessage.StateChange
    }

    stompClient?.publish({
      destination: `/ace/control/organizations/${organizationId}/devices/${device?.id}`,
      body: JSON.stringify(body)
    });
  }

  return (
    <div className={styles.device_card}>
      <div className={styles.device_card_header}>
        <h4>
          <Link href={`/dashboard/${organizationId}/devices/${device.id}`}>
            <a>{device.name}</a>
          </Link>
        </h4>
        <span className={styles.device_card_header_health}>{device.healthStatus || "Offline"}</span>
        <span onClick={toggleDeviceState} className={`${ currentState ? styles.device_card_header_enabled : styles.device_card_header_disabled} ${styles.device_card_header_state}`}>
          <BsCircleFill />
        </span>
      </div>
      <div>
        <h5>Latest Value: </h5>
        <p><span>{currentValue?.paramName}:</span><strong>{currentValue?.paramValue}</strong></p>
      </div>
    </div>
  );
}

export default DeviceCard;