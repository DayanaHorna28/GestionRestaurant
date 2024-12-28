import axios from "axios";
import Configuration from "./config";
import util from "./js/util";
const conf = Configuration.getConfiguration();

const createHeaders = () => {
    let headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "clientAuth": conf.CLIENT_AUTH,
        "client": conf.CLIENT_CODE,
        "X-Tenant": conf["X-Tenant"]
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.connectionId) {
        headers.Authorization = user.connectionId;
    }

    return headers;
};

const ServerConnection = (() => {
    const login = async (username, password) => {
        let payload = { username, password };
        return axios.post(`${conf.API}/login`, payload, { headers: createHeaders() });
    };

    const players = {
        list: async (params) => {
            const serializedParams = params ? util.serialize(params) : '';
            return axios.get(`${conf.API_PLAYERS}/players?${serializedParams}`, { headers: createHeaders() });
        },
        save: (payload) => {
            return axios.post(`${conf.API_PLAYERS}/players`, payload, { headers: createHeaders() });
        },
        destroy: (playerId) => {
            return axios.delete(`${conf.API_PLAYERS}/players/${playerId}`, { headers: createHeaders() });
        },
        changePassword: (playerId, payload) => {
            return axios.post(`${conf.API_PLAYERS}/players/changePassword/${playerId}`, payload, { headers: createHeaders() });
        }
    };

    const wallet = {
        balance: (params) => {
            return axios.get(`${conf.API}/../wallet/balance?userId=${params}`, { headers: createHeaders() });
        },
        addBalance: (payload) => {
            return axios.post(`${conf.API}/../wallet/balance`, payload, { headers: createHeaders() });
        },
        balancePlayer: (params) => {
            return axios.get(`${conf.API}/../players/${params}/`, { headers: createHeaders() });
        },
        deposit: (payload) => {
            return axios.post(`${conf.API}/../cashier/deposit`, payload, { headers: createHeaders() });
        },
        withdrawal: (payload) => {
            return axios.post(`${conf.API}/../cashier/withdrawal`, payload, { headers: createHeaders() });
        },
        withdrawalBankConfirm: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/movement/confirm`, payload, { headers: createHeaders() });
        }
    };

    const trx = {
        list: (params) => {
            return axios.get(`${conf.API_PLAYERS}/transactions?${util.serialize(params)}`, { headers: createHeaders() });
        }
    };

    const movements = {
        list: (params) => {
            return axios.get(`${conf.API_USERS}/wallet/movements?${util.serialize(params)}`, { headers: createHeaders() });
        },
        movementBankConfirm: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/movement/confirm`, payload, { headers: createHeaders() });
        },
        generateDeposit: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/deposit`, payload, { headers: createHeaders() });
        },
        depositBankAnull: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/deposit/cancel`, payload, { headers: createHeaders() });
        },
        withdrawalBankAnull: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/withdrawal/cancel`, payload, { headers: createHeaders() });
        },
        confirmCashout: (payload) => {
            return axios.post(`${conf.API_USERS}/wallet/cashout/confirm`, payload, { headers: createHeaders() });
        },
        reportSales: (params) => {
            return axios.get(`${conf.API_USERS}/wallet/salesReports?${util.serialize(params)}`, { headers: createHeaders() });
        },
        findByMovementId: (movementId) => {
            return axios.get(`${conf.API_USERS}/wallet/movement/${movementId}`, { headers: createHeaders() });
        }
    };

    const user = {
        refreshToken: (token) => {
            return axios.get(`${conf.API_USERS}/casino/refreshToken/${token}`, { headers: createHeaders() });
        }
    };

    const platform = {
        findByPlatformId: (platformId) => {
            return axios.get(`${conf.API_USERS}/casino/platforms/${platformId}`, { headers: createHeaders() });
        }
    };

    const cashBox = {
        save: (payload) => {
            return axios.post(`${conf.API_USERS}/casino/cash-box/open`, payload, { headers: createHeaders() });
        },
        update: (payload) => {
            return axios.post(`${conf.API_USERS}/casino/cash-box/close`, payload, { headers: createHeaders() });
        },
        findByUserIdAndCurrency: (userId, platformId, currency) => {
            return axios.get(`${conf.API_USERS}/casino/cash-box/${userId}/${currency}?platformId=${platformId}`, { headers: createHeaders() });
        },
        findAllByUserId: (userId, platformId) => {
            return axios.get(`${conf.API_USERS}/casino/cash-box/${userId}?platformId=${platformId}`, { headers: createHeaders() });
        },
        list: (params) => {
            return axios.get(`${conf.API_USERS}/casino/cash-box?${util.serialize(params)}`, { headers: createHeaders() });
        }
    };

    return {
        login,
        players,
        wallet,
        trx,
        movements,
        cashBox,
        user,
        platform
    };
})();

export default ServerConnection;
