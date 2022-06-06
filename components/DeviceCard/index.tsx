import { CompatClient, StompSubscription } from "@stomp/stompjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Device, DeviceData, SocketDataMessage } from "../../common/types";
import styles from "./DeviceCard.module.css";


interface DeviceCardProps {
  organizationId: string;
  device: Device;
  stompClient: CompatClient
}

const DeviceCard = ({device, organizationId, stompClient}: DeviceCardProps) => {

  const [socketSubscription, setSocketSubscription] = useState<StompSubscription>();
  const [currentValue, setCurrentValue] = useState<DeviceData | undefined>(device?.dataPoints?.at(-1));

  useEffect(()=>{
    if(stompClient?.connected){
      const subscription = stompClient.subscribe(`/deviceData/organizations/${organizationId}/devices/${device?.id}`, (frame)=>{
        const response: SocketDataMessage = JSON.parse(frame?.body); 
        setCurrentValue(response.data);
      });

      setSocketSubscription(subscription);
    }
    return () => {
      socketSubscription?.unsubscribe();
    }
  }, []);

  return (
    <div className={styles.device_card}>
      <div>
        <h4>
          <Link href={`/dashboard/${organizationId}/devices/${device.id}`}>
            <a>{device.name}</a>
          </Link>
        </h4>
        <span>{device.healthStatus}</span>
        <span>{device.enabled}</span>
      </div>
      <div>
        <h5>Current Value: </h5>
        <p><span>{currentValue?.paramName}:</span><strong>{currentValue?.paramValue}</strong></p>
      </div>
    </div>
  );
}

export default DeviceCard;