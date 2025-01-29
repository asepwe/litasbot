import axios from 'axios';
import log from "./logger.js"
import { newAgent } from './helper.js';


export async function getNewToken(token, refreshToken, proxy) {
    const agent = newAgent(proxy);
    const payload = { refreshToken };
    try {
        const response = await axios.post(`https://www.wallet.litas.io/api/v1/auth/refresh`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            httpsAgent: agent,
        });
        return response.data;
    } catch (error) {
        log.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

export async function getUserFarm(token, proxy) {
    const agent = newAgent(proxy);
    try {
        const response = await axios.get(`https://www.wallet.litas.io/api/v1/miner/current-user`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            httpsAgent: agent,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return "unauth";
        }
        log.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

export async function activateMining(token, proxy) {
    const agent = newAgent(proxy);
    try {
        const response = await axios.patch(
            'https://www.wallet.litas.io/api/v1/miner/activate',
            {},
            {
                headers: {
                    authorization: `Bearer ${token}`
                },
                httpsAgent: agent,
            }
        );

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return "unauth";
        } else if (error.response && error.response.status === 409) {
            return "success farm already activated";
        }
        log.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

export async function claimMining(token, proxy) {
    const agent = newAgent(proxy);
    try {
        const response = await axios.patch(
            'https://www.wallet.litas.io/api/v1/miner/claim',
            {},
            {
                headers: {
                    authorization: `Bearer ${token}`
                },
                httpsAgent: agent,
            }
        );

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return "unauth";
        } else if (error.response && error.response.status === 409) {
            return "success farm already claimed";
        }
        log.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

