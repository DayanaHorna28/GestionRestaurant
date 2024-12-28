import EventManager from "./EventManager.js";
import alertify from "alertifyjs";
import Configuration from "../config.js"

const conf = Configuration.getConfiguration()

const SocketConnector = (() => {
    let stompClient
    let movements = {
        "DEPOSIT-BANK": {value: "Deposito Bancario"},
        "WITHDRAW-BANK": {value: "Retiro Bancario"},
        "WITHDRAW-CASH": { value: "Retiro Efectivo" }
    };
    function sendHello(name){
        stompClient.send("/app/hello", {},name);
    }
    function disconnect(){
        if(stompClient){stompClient.disconnect(); }
        else{ console.log("No desconnect WS because doesnt exists") }
    }
    const createStompClient = (url, connectHeaders) => {
        return new StompJs.Client({
            brokerURL: url,
            connectHeaders: connectHeaders,
            debug: console.log,
            reconnectDelay: 2500
        });
    };
    function connect(platformId,user){
       //console.log(`Opening WS connection with  ${conf.WS_URL}/casino-user`)
        stompClient = createStompClient(`${conf.WS_URL}/casino-user`,{platformId: platformId,userId: user.userId,currencyISO:user.currencyISO,connectionId:user.connectionId })
        stompClient.onConnect = (frame) => {
            user.currencyISO.forEach(element => {
                stompClient.subscribe('/topic/'+platformId+'-'+element, (greeting) => {
                    let body=JSON.parse(greeting.body)
                    alertify.success(movements[body.event].value);
                    EventManager.publish(body.event,movements);
                    new Audio('home/music/iphone-notificacion.mp3').play();
                });
            });
            stompClient.subscribe('/users/queue/session', (greeting) => {
                let body = JSON.parse(greeting.body)
                EventManager.publish(body.message,greeting);
            });
        };
        stompClient.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
        };
        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
        stompClient.activate();
    }
    return {
        connect,disconnect,sendHello
    }
})()

export default SocketConnector
