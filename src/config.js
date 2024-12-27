
const Configuration = ( ()=>{
    const dev={
        CLIENTID: "45",
        GAMEAPI_URL:"https://prod-nd.apiusoft.com/api",
        API:"https://lobby-bff.apiusoft.com",
        CLIENT_AUTH:"GAWNGANAWIN2024GANA20GANAWIN2024WINGWIN",
        CLIENT_CODE:"GAWN",
        LOBBY_GAMES_API:"https://lobby.apiusoft.com",
        ASSETS:"https://assets.apiusoft.com",
        WS_URL:"wss://lobby-bff.apiusoft.com/lobbybff",
        country:"+56",
        operatorId:"123",
        domain:"http://ganawin.mx/",
        API_GAMES_NODE: "https://prod-nd.apiusoft.com",
        org:"GWN",
        platform: "Ganawin",
        currency:7,//ARS
        configSignup:{
            platform:'Ganawin',
            typeSignup: "codeAgent", //codeAgent / selectCurrency /  mixed (codeAgent and selectCurrency)
            userType: "X",// X / W
            currencies: [ 
                {id: "", agent:""},//
            ],
            countries: [
                //{prefix:"+216",flag:"tnz"},
                {prefix:"+52",flag:"mx"},
                {prefix:"+57",flag:"col"},
                 
            ]
        }
    }
    const local={
        CLIENTID: "45",
        GAMEAPI_URL:"https://prod-nd.apiusoft.com/api",
        //API:"http://192.168.1.35:5000",
        API:"https://lobby-bff.apiusoft.com",
        CLIENT_AUTH:"GAWNGANAWIN2024GANA20GANAWIN2024WINGWIN",
        CLIENT_CODE:"GAWN",
        LOBBY_GAMES_API:"https://lobby.apiusoft.com",
        ASSETS:"https://assets.apiusoft.com",
        WS_URL:"wss://lobby-bff.apiusoft.com/lobbybff",
        country:"+56",
        operatorId:"123",
        platform: "Ganawin",
        domain:"http://ganawin.mx/",
        API_GAMES_NODE: "https://prod-nd.apiusoft.com",
        org:"GWN",
        currency:7,//ARS
        configSignup:{
            platform:'Ganawin',
            typeSignup: "codeAgent", //codeAgent / selectCurrency /  mixed (codeAgent and selectCurrency)
            userType: "X",// X / W
            currencies: [ 
                {id: 7, agent:6681},//
            ],
            countries: [
                //{prefix:"+216",flag:"tnz"},
                {prefix:"+52",flag:"mx"},
                {prefix:"+57",flag:"col"},
                 
            ]
        }

    }
    const prod={
        CLIENTID: "45",
        GAMEAPI_URL:"https://prod-nd.apiusoft.com/api",
        API:"https://lobby-bff.apiusoft.com",
        CLIENT_AUTH:"GAWNGANAWIN2024GANA20GANAWIN2024WINGWIN",
        CLIENT_CODE:"GAWN",
        LOBBY_GAMES_API:"https://lobby.apiusoft.com",
        ASSETS:"https://assets.apiusoft.com",
        WS_URL:"wss://lobby-bff.apiusoft.com/lobbybff",
        country:"+56",
        platform: "Ganawin",
        operatorId:"123",
        domain:"http://ganawin.mx/",
        API_GAMES_NODE: "https://prod-nd.apiusoft.com",
        org:"GWN",
        currency:7,//ARS
        configSignup:{
            platform:'Ganawin',
            typeSignup: "codeAgent", //codeAgent / selectCurrency /  mixed (codeAgent and selectCurrency)
            userType: "X",// X / W
            currencies: [ 
                {id: 7, agent:6681},//
            ],
            countries: [
                //{prefix:"+216",flag:"tnz"},
                {prefix:"+52",flag:"mx"},
                {prefix:"+57",flag:"col"},
                 
            ]
        }
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