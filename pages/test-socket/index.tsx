import { Stomp } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';

export default function TestSocket(){
  useEffect(()=>{
    const stompClient = Stomp.over(()=> new SockJS("http://localhost:9911/ace-sock"));

    stompClient.debug = ()=>{};

    stompClient.onConnect = () => {
      console.log("Connected");

      stompClient.subscribe("/device/data/312", (frame)=>{
        const response = JSON.parse(frame?.body); 
        console.log(response);
      });

      stompClient.publish({
        destination:"/ace/data/312",
        body:JSON.stringify({
          message:"Some message",
          data:"Some data with a message"
        })
      })
    }

    stompClient.onDisconnect = () => {
      console.log("Disconnected");
    }

    stompClient.activate();

    return () => {
      stompClient.unsubscribe("/device/data/312");
      stompClient.deactivate();
    }

  },[]);


  return (
    <div>
      Some gibberish
    </div>
  );
}