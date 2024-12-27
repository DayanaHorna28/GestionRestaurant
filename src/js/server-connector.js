import EventManager from "./EventManager.js";

import Configuration from "../config"

const conf = Configuration.getConfiguration()

const ServerConnector = (() => {

    let stompClient
    let playerId
/*
    function connect(afterConnectionOperation) {
        console.log(`Opening WS connection with Casino`)
        stompClient = Stomp.client("ws://localhost:5000/lobbybff")
        stompClient.debug = null

        stompClient.onclose = ((frame) => {
            console.log("Socket closed")
            //EventManager.publish("logout", {})
            playerId = undefined
        })

        stompClient.connect({},
          (frame) => {
              stompClient.subscribe(`/topic/messages`, (frame) => {
                  const event = JSON.parse(frame.body)
                  console.log({event})
              })
              stompClient.subscribe(`/user/queue/greetings`, (frame) => {
                  const event = JSON.parse(frame.body)
                  console.log({event})
                  EventManager.publish("error", event)
              })
              stompClient.subscribe(`/user/queue/balance`, (frame) => {
                  const event = JSON.parse(frame.body)
                  playerId = event.playerId
                  EventManager.publish("balance", event)
              })
              stompClient.subscribe(`/user/queue/logout`, (frame) => {
                  EventManager.publish("logout", {})
              })
              afterConnectionOperation()
          },
          (error) => {
              playerId = undefined
              console.error(`Error: ${error}`)
              EventManager.publish("logout", {})
              EventManager.publish("error", {errorCode: "OIV9FABT2A", errorMessage: "Connection closed"})
          })

    }
*/
    
    

 

    function sendHello(name){
        stompClient.send("/app/hello", {},name);
    }

    /*function sendName(name) {
        stompClient.send("/app/greetings", {},name);
    }*/

    function disconnect(){

        if(stompClient){stompClient.disconnect(); }
        else{ console.log("No desconnect WS because doesnt exists") }
    }
    function connect(username){
        console.log(`Opening WS connection with lobbybff`)
        stompClient = Stomp.client( conf.WS_URL)
        stompClient.debug = null
        stompClient.reconnect_delay = 5000;
        stompClient.onclose = ((frame) => {
            console.log("Socket closed")
            //EventManager.publish("logout", {})
            playerId = undefined
        })

        stompClient.connect({username},(frame) => {
            console.log("Connected!", frame);
            stompClient.subscribe(`/user/queue/messages`, (message) => {
                console.log("socket-message", message);
                console.log("body",message.body);
                if(message.body=="NEW_SESSION_OPENED"){
                    console.log("NEW_SESSION_OPENED");
                    EventManager.publish("duplicated_session",{})

                }
                //const event = JSON.parse(frame.body)
                //console.log({event})
            })

              /*stompClient.subscribe(`/topic/messages`, (frame) => {
                  const event = JSON.parse(frame.body)
                  console.log({event})
              })
              stompClient.subscribe(`/user/queue/greetings`, (greeting) => {
                console.log("GREEETING",greeting.body);
              })*/
              
              //afterConnectionOperation()
          },
          (error) => {
              playerId = undefined
              console.error(`Error: ${error}`)
              EventManager.publish("logout", {})
              EventManager.publish("error", {errorCode: "OIV9FABT2A", errorMessage: "Connection closed"})
          })
    }

    return {
        connect,disconnect, sendHello
    }

})()

export default ServerConnector
