
const Configuration = ( ()=>{
    const dev={
        CLIENT_AUTH:"M3ND0za",
        API: "https://ms-test.apiusoft.com/user-service/casino",
        API_PLAYERS: "https://ms-test.apiusoft.com/player-service", 
        API_USERS: "https://ms-test.apiusoft.com/user-service",
        ASSETS:"https://assets.apiusoft.com",
        //WS_URL: "wss://casino-ws.apiusoft.com",
        WS_URL: "wss://casino-stage-ws.apiusoft.com/casino-user",
        'X-Tenant': 'demo-platform'
    }
    
    const local={
        CLIENT_AUTH: "M3ND0za",
        //API: "http://192.168.1.35:8042/casino",
        API: "https://ms-test.apiusoft.com/user-service/casino",
        API_PLAYERS: "https://ms-test.apiusoft.com/player-service",
        API_USERS: "https://ms-test.apiusoft.com/user-service",
        ASSETS: "https://assets.apiusoft.com",
        PHARSE:"",
        //WS_URL: "wss://casino-ws.apiusoft.com",
        WS_URL: "wss://casino-stage-ws.apiusoft.com/casino-user",
        'X-Tenant': 'demo-platform'
    }
    const prod={
        API: "https://ms-test.apiusoft.com/user-service/casino",
        API_PLAYERS: "https://ms-test.apiusoft.com/player-service",
        API_USERS: "https://ms-test.apiusoft.com/user-service",
        ASSETS: "https://assets.apiusoft.com",
        PHARSE:"",
        //WS_URL: "wss://casino-ws.apiusoft.com",
        WS_URL: "wss://casino-stage-ws.apiusoft.com/casino-user",
        'X-Tenant': 'demo-platform'
    }

    const configMap=new Map()
    configMap.set("local",local)
    configMap.set("dev",dev)
    configMap.set("prod",prod)

    const getEnv=()=>{
        const host=window.location.toString()
        const env = host.indexOf('localhost')>0||host.indexOf("127.0.0.1")>0?'local':host.indexOf('dev')>0?'dev':'prod'
        return env;
    }


    const getConfiguration=()=>{
        const env = getEnv()
        console.log("You are in " + env);
        const config = configMap.get(env)
        return config
    }
    return {getConfiguration, getEnv}
}) (  )

export default Configuration