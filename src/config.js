const Configuration = (() => {
    const dev = {
        API: "https://admin-bo-api.apiusoft.com/api",
        ASSETS: "https://assets.apiusoft.com",
        APIUSERS: "https://casino-stage.apiusoft.com", 
        GATEWAYAPI: "https://srv-prod-bonus-ca.apiusoft.com",
        //GATEWAYAPI: "https://ms-test.apiusoft.com/free-spin",
        AGREGATORAPI:"https://srv-prod.apiusoft.com"
        
    }
    const local = {
        API: "https://admin-bo-api.apiusoft.com/api",
        //GATEWAYAPI: "https://ms-test.apiusoft.com/free-spin",
        GATEWAYAPI: "https://srv-prod-bonus-ca.apiusoft.com",
        ASSETS: "https://assets.apiusoft.com",
        APIUSERS: "https://casino-stage.apiusoft.com", 
        AGREGATORAPI:"https://srv-prod.apiusoft.com"
    }
    const prod = {
        API: "https://admin-bo-api.apiusoft.com/api",
        ASSETS: "https://assets.apiusoft.com",
        APIUSERS: "https://casino-stage.apiusoft.com", 
        //GATEWAYAPI: "https://ms-test.apiusoft.com/free-spin",
        GATEWAYAPI: "https://srv-prod-bonus-ca.apiusoft.com",
        AGREGATORAPI:"https://srv-prod.apiusoft.com"
    }

    const configMap = new Map()
    configMap.set("local", local)
    configMap.set("dev", dev)
    configMap.set("prod", prod)


    const getEnv = () => {
        const host = null?window.location.toString():'';
        const env = /localhost|127.0.0.1/.test(host) ? 'local' : /dev/.test(host) ? 'dev' : 'prod';
        console.log("YOU ARE ON "+env);
        return env;
    }

    const getConfiguration = () => {
        const env = getEnv()
        const config = configMap.get(env)
        return config
    }
    return { getConfiguration, getEnv }
})()

export default Configuration