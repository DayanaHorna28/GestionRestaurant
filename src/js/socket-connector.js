import EventManager from "./EventManager.js";

const ServerConnector = (() => {

    let stomp
    let playerId

    function connectUser(afterConnectionOperation) {
        //console.log(`Opening WS connection with Casino`)
        stomp = Stomp.client("ws://localhost:5000/user-movements")
        stomp.debug = null

        stomp.onclose = ((frame) => {
            console.log("Socket closed")
            EventManager.publish("logout", {})
            playerId = undefined
        })

        stomp.connect({},
          (frame) => {
            stomp.subscribe(`/topic/casino`, (frame) => {
                  const event = JSON.parse(frame.body)
                  console.log({event})
              })
              stomp.subscribe(`/user/queue/error`, (frame) => {
                  const event = JSON.parse(frame.body)
                  console.log({event})
                  EventManager.publish("error", event)
              })
              stomp.subscribe(`/user/queue/balance`, (frame) => {
                  const event = JSON.parse(frame.body)
                  playerId = event.playerId
                  EventManager.publish("balance", event)
              })
              stomp.subscribe(`/user/queue/logout`, (frame) => {
                  EventManager.publish("logout", {})
              })
              stomp.subscribe(`/player/queue/trxCompleted`, (frame) => {
                console.log("frame",frame);
                alert("trxComplete1");
            })
            stomp.subscribe(`/user/queue/trxCompleted`, (frame) => {
                console.log("frame",frame);
                alert("trxComplete1");
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

    function register() {
        const sendMessage = () => {
            /*stompClient.send("/app/register", {}, JSON.stringify({
                username: "diego1",
                password: "6543211",
                currencyISO: "PEN",
                operatorId: "coliseosport"
            }))*/
        }
        if (!stomp || !stomp.connected) {
            connectUser(sendMessage)
        } else {
            sendMessage()
        }
    }

    function login() {
        const sendMessage = () => {
            stomp.send("/app/hello", {}, JSON.stringify({
                username: "superadmin",
                password: "superadmin",
                operatorId: "coliseosport"
            }))
        }
        if (!stomp || !stomp.connected) {
            connectUser(sendMessage)
             console.log("stomp",stomp);

        } else {
            sendMessage()
        }

    }

    function logout() {
        if (stomp && stomp.connected) {
            stomp.send("/app/logout", {}, JSON.stringify({
                playerId
            }))
        } else {
            EventManager.publish("error", {
                errorCode: "QLLFQ9CQ53",
                errorMessage: "Connection closed"
            })
        }
    }

    function transaction() {
        if (stomp && stomp.connected) {
            stomp.send("/app/transaction", {}, JSON.stringify({
                playerId:"X-655950e5-5e6f-4690-b92a-1d7edefd0e13"
            }))
        } else {
            EventManager.publish("error", {
                errorCode: "QLLFQ9CQ53",
                errorMessage: "Connection closed"
            })
        }
    }


    function deposit(amount, currencyISO) {
        if (stomp && stomp.connected) {
            stomp.send("/app/deposit", {}, JSON.stringify({
                playerId,
                amount,
                currencyISO
            }))
        } else {
            EventManager.publish("error", {
                errorCode: "QLLFQ9CQ53",
                errorMessage: "Connection closed"
            })
        }
    }

    function withdraw(amount, currencyISO) {
        if (stomp && stomp.connected) {
            stomp.send("/app/withdraw", {}, JSON.stringify({
                playerId,
                amount,
                currencyISO
            }))
        } else {
            EventManager.publish("error", {
                errorCode: "QLLFQ9CQ53",
                errorMessage: "Connection closed"
            })
        }
    }

    return {
        register, login, logout,
        deposit, withdraw,transaction
    }

})()

export default ServerConnector
