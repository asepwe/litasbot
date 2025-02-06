import log from "./utils/logger.js"
import bedduSalama from "./utils/banner.js"
import { delay, readAccountsFromFile, readFile } from './utils/helper.js';
import { claimMining, getNewToken, getUserFarm, activateMining } from './utils/api.js';
import fs from 'fs/promises';

async function refreshAccessToken(token, refreshToken, proxy) {
    let refresh;
    do {
        refresh = await getNewToken(token, refreshToken, proxy);
        if (!refresh) log.info('Token refresh failed, retrying...');
        await delay(3);
    } while (!refresh);
    log.info('Token refreshed succesfully', refresh);
    return refresh;
}

async function activateMiningProcess(token, refreshToken, proxy) {
    let activate;

    do {
        activate = await activateMining(token, proxy);
        if (activate === "unauth") {
            log.warn('Unauthorized, refreshing token...');
            const refreshedTokens = await refreshAccessToken(token, refreshToken, proxy);
            token = refreshedTokens.accessToken;
            refreshToken = refreshedTokens.refreshToken;
        } else if (!activate) {
            log.info('Activation failed, retrying...');
            await delay(3);
        }
    } while (!activate || activate === "unauth");

    log.info('Mining activated response:', activate);

    return token;
}

async function getUserFarmInfo(accessToken, refreshToken, proxy, index) {
    let userFarmInfo;
    do {
        log.warn(`Account ${index}, refreshing token...`);
        const refreshedTokens = await refreshAccessToken(accessToken, refreshToken, proxy);
        accessToken = refreshedTokens.accessToken;
        refreshToken = refreshedTokens.refreshToken;
        userFarmInfo = await getUserFarm(accessToken);
        if (!userFarmInfo) log.warn(`Account ${index} get farm info failed, retrying...`);
        await delay(3);
    } while (!userFarmInfo);
    const { status, totalMined } = userFarmInfo;
    log.info(`Account ${index} farm info:`, { status, totalMined });
    return { userFarmInfo, accessToken, refreshToken };
}

async function handleFarming(userFarmInfo, token, refreshToken, proxy) {
    const canBeClaimedAt = new Date(userFarmInfo.canBeClaimedAt).getTime();
    const timeNow = new Date().getTime();

    if (canBeClaimedAt < timeNow) {
        log.info('Farming rewards are claimable. Attempting to claim farming rewards...');
        let claimResponse;

        do {
            claimResponse = await claimMining(token, proxy);
            if (!claimResponse) log.info('Failed to claim farming rewards, retrying...');
            await delay(3);
        } while (!claimResponse);

        log.info('Farming rewards claimed response:', claimResponse);
        await activateMiningProcess(token, refreshToken, proxy)
    } else {
        log.info('Farming rewards can be claimed at:', new Date(canBeClaimedAt).toLocaleString())
    }
}

async function main() {
    log.info(bedduSalama);
    let accounts = await readAccountsFromFile("tokens.txt");
    const proxies = await readFile("proxy.txt");

    if (accounts.length === 0) {
        log.warn('No tokens found, exiting...');
        process.exit(0);
    } else {
        log.info('Running with total Accounts:', accounts.length);
    }
    if (proxies.length === 0) {
        log.warn('No proxy found, running without proxy...');
    }

    while (true) {
        for (let i = 0; i < accounts.length; i++) {
            const proxy = proxies[i % proxies.length] || null;
            const account = accounts[i];
            try {
                const { token, reToken } = account;
                log.info(`Processing run account ${i + 1} of ${accounts.length} with: ${proxy || "No proxy"}`);
                const { userFarmInfo, accessToken, refreshToken } = await getUserFarmInfo(token, reToken, proxy, i + 1);
                await activateMiningProcess(accessToken, refreshToken, proxy);
                await handleFarming(userFarmInfo, accessToken, refreshToken, proxy);

                account.token = accessToken;
                account.reToken = refreshToken;
            } catch (error) {
                log.error('Error:', error.message);
            }
            await delay(3);
        }

        await writeAccountsToFile("tokens.txt", accounts);

        log.info(`All accounts processed, waiting 1 hour before next run...`);
        await delay(60 * 60);
    }
}

async function writeAccountsToFile(filename, accounts) {
    const data = accounts.map(account => `${account.token}|${account.reToken}`).join('\n');
    await fs.writeFile(filename, data, 'utf-8');
}

process.on('SIGINT', () => {
    log.warn(`Process received SIGINT, cleaning up and exiting program...`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    log.warn(`Process received SIGTERM, cleaning up and exiting program...`);
    process.exit(0);
});

main();
