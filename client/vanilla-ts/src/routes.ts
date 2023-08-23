import { DrawData } from "./types";

let socket:WebSocket;

export const initWSConnection = () => {
    socket = new WebSocket("ws://127.0.0.1:3000/ws");
    console.log("Attempting Connection...");
  
    socket.onopen = () => {
        console.log("Successfully Connected");
    };
    
    socket.onclose = event => {
        console.log("Socket Closed Connection: ", event);
    };
  
    socket.onerror = error => {
        console.log("Socket Error: ", error);
    };
  
    socket.onmessage = (ev:MessageEvent) => {
      
      if ((ev.data as string).indexOf("{") > -1) {
        const dData:DrawData = JSON.parse(ev.data);
        console.log(dData);
        
        const receivedData = new CustomEvent("DrawDataReceived", {
            detail: dData
        });
        document.dispatchEvent(receivedData);
      } else {
        console.log(ev.data);
      }
    }

    document.addEventListener("DrawDataSent", (ev: CustomEvent) => {
        socket.send(JSON.stringify(ev.detail));
    })
}