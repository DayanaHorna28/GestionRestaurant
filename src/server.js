import Configuration from "./config"
import util from "./js/util"
import axios from "axios"

let conf;

try {
    conf = Configuration.getConfiguration();
    console.log(conf);
} catch (error) {
    console.log(error);
}

const serverConnection = (() => {


    let headers = { "Content-Type": "application/json;charset=UTF-8" }

    const login = async (username, password) => {
        let payload = { username, password }
        return axios.post(`${conf.API}/adminusers/login`, payload);
    };

    const client = {
        list: async (params = "") => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/clients?${params}`, { headers });
        },
        save: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/clients`, payload, { headers });
        },
        remove: async (id) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.API}/clients/${id}`, { headers });
        },
        checkProviderCredential: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            params = util.serialize(params)
            return axios.get(`${conf.APIUSERS}/clients/checkProviderCredential?${params}`, { headers });
        },
        checkClientCredential: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            console.log("Checking client c redentials", payload);
            return axios.post(`${conf.API}/games/client/${payload.client_id}/provider/${payload.provider}/currency/${payload.currency}/checkCredentialsGames`, payload, { headers });
        },
        listCredentialsGames: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/secrets`, { headers});
        },
        saveCredentials: async (payload, section) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            headers.section = section;
            return axios.post(`${conf.API}/secrets`, payload, { headers });
        },
        deleteCredentials: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            headers.section = payload.section;
            return axios.delete(`${conf.API}/secrets?secretName=${payload.keyId}`, { headers });
        },
        listCarrusels: async (params) =>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = util.serialize(params)
            return axios.get(`${conf.API}/banners?${query}`, { headers });
        },
        saveCarrusel: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            headers["Content-Type"] = "multipart/form-data";
            return axios.post(`${conf.API}/banners`, payload, { headers });
        },
        deleteCarrusel: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.delete(`${conf.API}/banners?${params}`, { headers });
        },
        listTopGames: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = util.serialize(params);
            return axios.get(`${conf.API}/topGame?${query}`, { headers });
        },
        saveGamesPosition: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/topGame`, payload, { headers });
        },
        listSections: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/section`, { headers });

        },
        listTypes: async () =>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/types`, { headers });
        },
        addType: async (type) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/types`, type, { headers });
        },
        deleteTops: async (id) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.API}/topGame/${id}`, { headers }); 
        }
    }

    const provider = {
        listByClient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = util.serialize(params)
            return axios.get(`${conf.API}/games/providers?${query}`, { headers });
        },
        listByClientByName: async (params) => {
            let clientName = params.clientName;
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/providers?clientName=${clientName}`, { headers });
        },
        listBrands: async (provider) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/providers/${provider}/brands`, { headers });
        },
        listGames: async (clientId, provider = null, brand = null) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = `clientId=${clientId}`;
            if (provider) query = query + `&provider=${provider}`
            if (brand) query = query + `&brand=${brand}`
            return axios.get(`${conf.API}/games?${query}`, { headers });
        },
        removeBrands: async (payload) => {
            const headers = {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
                'Content-Type': 'application/json' 
            };
            let payload2 = {
                clienteid: payload.clientId, 
                provider: payload.provider,
                action: payload.action,
                brands: payload.brands,
                category: payload.category,
                type: payload.type,
                original: payload.original,
                direct: payload.direct
            };
            if (!payload2.category) delete payload2.category;
            if (!payload2.type) delete payload2.type;
            if (!payload2.original) delete payload2.original;
            if (!payload2.direct) delete payload2.direct;
            return axios.post(`${conf.API}/games/client/${payload.clientId}/provider/${payload.provider}`, payload2, { headers });
        },
        
        addBrands: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let payload2 = {
                brands: payload.brands,
                action: payload.action,
                category: payload.category,
                type: payload.type,
                original: payload.original,
                direct: payload.direct
            }
            if (!payload2.category) delete payload2.category
            if (!payload2.type) delete payload2.type
            if (!payload2.original) delete payload2.original
            if (!payload2.direct) delete payload2.direct
            return axios.post(`${conf.API}/games/client/${payload.clientId}/provider/${payload.provider}`, payload2 , { headers });
        },
        listBrandsWithoutClient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query
            query = util.serialize(params)
            return axios.get(`${conf.API}/games/client?${query}`, { headers });
        },
    }

    const games = {
        list: async (params = '') => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/games?${params}`, { headers });
        },
        listCategories: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = util.serialize(params)
            return axios.get(`${conf.API}/games/category?${query}`, { headers });
        },
        listTypes: async (category) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/${category}/types`, { headers });
        },
        listProvider: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/providers`, { headers });
        },
        listBrands: async (provider) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/providers/${provider}/brands`, { headers });
        },
        listBrandsByClient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query
            query = util.serialize(params)
            return axios.get(`${conf.API}/games/brandsByclient?${query}`, { headers });
        },
        listBrandsNotByClient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query
            query = util.serialize(params)
            return axios.get(`${conf.API}/games/brandsNotByclient?${query}`, { headers });
        },
        saveGame: async (formData) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            headers["Content-Type"] = "multipart/form-data";
            return axios.post(`${conf.API}/games`, formData, { headers });
        },
        remove: async (id) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.API}/games/${id}`, { headers });
        },
        listGamesbyclient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query
            query = util.serialize(params)
            return axios.get(`${conf.API}/games?${query}`, { headers });
        },
        listGamesWithoutClient: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            let query = `clientId=${params.clientId}`;
            if (params.provider) query = query + `&provider=${params.provider}`
            if (params.brand) query = query + `&brand=${params.brand}`
            if (params.search) query = query + `&search=${params.search}`
            return axios.get(`${conf.API}/games/notwithclient?${query}&page=${params.page}&xpage=${params.xpage}`, { headers });
        },

        removeGamesbyclient: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.API}/clients/${payload.clientId}/games/${payload.gameId}`, { headers });
        },
        addGametoClient: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/clients/${payload.clientId}/games/${payload.gameId}`, payload, { headers });
        },
        listPragmaticFrbGames: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.GATEWAYAPI}/freespins/frbGamesPragmatic`, { headers });
        },
    }

    const gamers = {
        list: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/users?${params}`, { headers });
        }
    }

    const adminusers = {
        list: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/adminusers?${params}`, { headers });
        },
        remove: async (id) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.API}/adminusers/${id}`, { headers });
        },
        save: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/adminusers/register`, payload, { headers });
        },
        changePassword: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/adminusers/change-password`, payload, { headers });
        }
    }

    const work = {
        list: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/work/`, { headers });
        },
        listUsers: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/work/users`, { headers });
        },
        listGroups: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/work/groups`, { headers });
        },
        listItemsByGroup: async (groupId) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/work/itemsbygroup/${groupId}`, { headers });
        }

    }

    const freespin = {
        list: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.GATEWAYAPI}/freespins/?${params}`, { headers });
        },

        remove: async (id, provider) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.GATEWAYAPI}/freespins/${id}/${provider}`, { headers });
        },

        create: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.GATEWAYAPI}/freespins/`, payload, { headers });
        },
        authCampaign: async() =>{
            let payload = {
                clientId: "ADMINBO",
                clientSecret: "123456"
            }
            return axios.get(`${conf.GATEWAYAPI}/auth`, payload);
        },
        syncCampaign: async() =>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.GATEWAYAPI}/first/syncCampaigns`);
        },
        listCampaigns: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.GATEWAYAPI}/campaigns/search?${params}`);
        },
        listPlatforms: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.GATEWAYAPI}/platform`);
        },
        listBonus: async (params) =>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.GATEWAYAPI}/bonus/search?${params}`);
        },
        saveBonus: async (payload)=>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.GATEWAYAPI}/first/assign`, payload);
        },
        deleteBonus: async (params)=>{
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.GATEWAYAPI}/first/cancel/${params.code}`);
        },
        listFreeBets: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.GATEWAYAPI}/freebets/search?${params}`);
        },
        saveFreeBet: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.GATEWAYAPI}/freebets/assign/${payload.bonusId}`, payload);
        },
        deleteFreeBet: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.delete(`${conf.GATEWAYAPI}/freebets/cancel/${params.code}`);
        }
    }

    const bonus = {
        list: async (params) => {
            headers.Authorization = sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.APIUSERS}/bonus/api/bonus/?${params}`, { headers })
        },
        save: async (payload) => {
            headers.Authorization = sessionStorage.getItem("token");
            return axios.post(`${conf.APIUSERS}/bonus/api/bonus`, payload, { headers });
        },
    }

    const trx = {
        list: async (params = '') => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/trx/list?${params}`, { headers });
        },
        logs: async (params = '') => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/trx/logs?${params}`, { headers });
        },
        paymentDirect: async (payload) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.post(`${conf.API}/trx/paymentDirect`, payload, { headers });
        }

    }

    const reports = {
        list: async (params = '') => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/trx/summary?${params}`, { headers });
        }
    }

    const brands = {
        list: async (params) => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            if (params) { params = util.serialize(params) }
            return axios.get(`${conf.API}/brands?${params}`, { headers });
        },
        listBrandsByCategory: async () => {
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return axios.get(`${conf.API}/games/brandsByCategory`, { headers });
        },
        saveBrand: async (params, formData) => {
            let brand = params.brand;
            headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            headers["Content-Type"] = "multipart/form-data";
            return axios.post(`${conf.API}/brands/uploadimage?brand=${brand}`, formData, { headers });
        }
    }

    return {
        login, client, trx, provider, games, gamers, brands, freespin, adminusers, reports, bonus, work
    }

})()
export default serverConnection