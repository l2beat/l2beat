#!/usr/bin/env node

import { ethers } from 'ethers';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// --- Configuration ---
const ZKSYNC2_RPC_URL = process.env.ZKSYNC2_RPC_URL;
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;

// Contract Addresses
const ZK_PROTOCOL_GOVERNOR_ADDR = '0x76705327e682F2d96943280D99464Ab61219e34f'; // ZKsync Era
const L1_MESSENGER_ADDR = '0x0000000000000000000000000000000000008008'; // ZKsync Era (System Contract)
const PROTOCOL_UPGRADE_HANDLER_ADDR = '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3'; // Ethereum L1

// --- ABIs ---
const ZK_PROTOCOL_GOVERNOR_ABI = [
    "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)",
    "event ProposalExecuted(uint256 proposalId)",
    "event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline)", // Added event
    "function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)",
    "function state(uint256 proposalId) view returns (uint8)", // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    "function quorum(uint256 blockNumber) view returns (uint256)" // blockNumber is timepoint here
];
const L1_MESSENGER_ABI = [ "event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)" ];
const PROTOCOL_UPGRADE_HANDLER_ABI = [
    "event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)",
    "function upgradeState(bytes32 _id) view returns (uint8)", // 0:None, 1:LegalVeto, 2:Waiting, 3:ExecutionPending, 4:Ready, 5:Expired, 6:Done
    "function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)"
];

// --- Types and Interfaces ---
const UPGRADE_PROPOSAL_TYPE = "tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)";
const VOTE_TOKEN_DECIMALS = 18;

interface Call { target: string; value: ethers.BigNumber; data: string; }
interface UpgradeProposal { calls: Call[]; executor: string; salt: string; }
interface ProposalCreatedData { proposalId: ethers.BigNumber; proposer: string; targets: string[]; values: ethers.BigNumber[]; signatures: string[]; calldatas: string[]; voteStart: ethers.BigNumber; /* Timestamp */ voteEnd: ethers.BigNumber; /* Timestamp */ description: string; blockNumber: number; txHash: string; }
interface ProposalExecutedData { proposalId: ethers.BigNumber; blockNumber: number; txHash: string; }
interface ProposalExtendedData { proposalId: ethers.BigNumber; extendedDeadline: ethers.BigNumber; /* Timestamp */ blockNumber: number; txHash: string; } // Added interface
interface L1MessageSentData { sender: string; hash: string; message: string; blockNumber: number; txHash: string; }
interface UpgradeStartedData { id: string; proposal: UpgradeProposal; blockNumber: number; txHash: string; }
interface UpgradeStatusData { creationTimestamp: number; securityCouncilApprovalTimestamp: number; guardiansApproval: boolean; guardiansExtendedLegalVeto: boolean; executed: boolean; }
interface EventCache { lastL2BlockFetched: number; proposalCreatedEvents: ProposalCreatedData[]; proposalExecutedEvents: ProposalExecutedData[]; proposalExtendedEvents: ProposalExtendedData[]; /* Added */ }

// --- Constants ---
const CACHE_FILE = path.join(__dirname, 'governance_event_cache.json');
const L1_EVENT_SEARCH_BLOCK_RANGE = 1_000_000;
const L2_MESSENGER_SEND_SELECTOR = "0x62f84b24";
const L1_STANDARD_LEGAL_VETO_SECONDS = 3 * 24 * 60 * 60;
const L1_EXTENDED_LEGAL_VETO_SECONDS = 7 * 24 * 60 * 60;
const L1_UPGRADE_DELAY_SECONDS = 1 * 24 * 60 * 60;
const L1_WAIT_OR_EXPIRE_SECONDS = 30 * 24 * 60 * 60;

// --- Helper Functions ---

function loadCache(): EventCache {
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            const cache: EventCache = JSON.parse(data, (key, value) => {
                if (typeof value === 'object' && value !== null && value.type === 'BigNumber') {
                    return ethers.BigNumber.from(value.hex);
                }
                return value;
            });
            console.log(chalk.gray(`Loaded cache from ${CACHE_FILE}. Last L2 block fetched: ${cache.lastL2BlockFetched}`));
            cache.proposalCreatedEvents = cache.proposalCreatedEvents || [];
            cache.proposalExecutedEvents = cache.proposalExecutedEvents || [];
            cache.proposalExtendedEvents = cache.proposalExtendedEvents || []; // Initialize new cache array
            return cache;
        } catch (error) {
            console.warn(chalk.yellow(`Could not read cache file ${CACHE_FILE}: ${error}. Starting fresh.`));
        }
    }
    // Initialize with all arrays
    return { lastL2BlockFetched: 0, proposalCreatedEvents: [], proposalExecutedEvents: [], proposalExtendedEvents: [] };
}
function saveCache(cache: EventCache): void { /* ... (no changes) ... */
    try {
        const data = JSON.stringify(cache, (key, value) => {
            if (ethers.BigNumber.isBigNumber(value)) {
                return { type: 'BigNumber', hex: value.toHexString() };
            }
            return value;
        }, 2);
        fs.writeFileSync(CACHE_FILE, data, 'utf-8');
        console.log(chalk.gray(`Saved cache to ${CACHE_FILE}. Last L2 block fetched: ${cache.lastL2BlockFetched}`));
    } catch (error) {
        console.error(chalk.red(`Error saving cache: ${error}`));
    }
 }
function formatTimestamp(timestamp: number | ethers.BigNumber | undefined): string {
    if (!timestamp || ethers.BigNumber.from(timestamp).isZero()) return "N/A";
    try {
        const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000);
        return date.toLocaleString();
    } catch (e) {
        console.warn(chalk.yellow(`Could not format timestamp ${timestamp}: ${e}`));
        return "Invalid Date";
    }
}
function mapL2State(state: number): string { /* ... (no changes) ... */
    const states = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
    return states[state] ?? `Unknown (${state})`;
 }
function mapL1State(state: number): string { /* ... (no changes) ... */
    const states = ["None", "LegalVetoPeriod", "Waiting", "ExecutionPending", "Ready", "Expired", "Done"];
    return states[state] ?? `Unknown (${state})`;
 }
function formatValue(value: ethers.BigNumber | undefined | null): string { /* ... (no changes) ... */
     if (value === undefined || value === null) return 'N/A';
     try { return ethers.BigNumber.from(value).isZero() ? '0' : ethers.utils.formatUnits(value, 'ether'); }
     catch (e) { return `Invalid (${value?.toString() ?? 'undefined'})`; }
 }
function formatUnits(value: ethers.BigNumber | undefined | null, decimals: number): string { /* ... (no changes) ... */
     if (value === undefined || value === null) return 'N/A';
     try { return ethers.utils.formatUnits(value, decimals); }
     catch (e) { return `Invalid (${value?.toString() ?? 'undefined'})`; }
 }
function calculatePercentage(numerator: ethers.BigNumber, denominator: ethers.BigNumber): string { /* ... (no changes) ... */
    if (denominator.isZero()) return "0.00";
    try {
        const numFixed = ethers.FixedNumber.fromValue(numerator, VOTE_TOKEN_DECIMALS);
        const denFixed = ethers.FixedNumber.fromValue(denominator, VOTE_TOKEN_DECIMALS);
        if (denFixed.isZero()) return "0.00";
        const percentage = numFixed.mulUnsafe(ethers.FixedNumber.from(100)).divUnsafe(denFixed);
        return percentage.round(2).toString();
    } catch (e) { console.warn(chalk.yellow(`Error calculating percentage (${numerator}/${denominator}): ${e}`)); return "Error"; }
 }
function formatDuration(totalSeconds: number): string { /* ... (no changes) ... */
    if (totalSeconds < 0) totalSeconds = 0;
    if (totalSeconds === 0) return "Ended";
    const days = Math.floor(totalSeconds / (24 * 60 * 60)); totalSeconds %= (24 * 60 * 60);
    const hours = Math.floor(totalSeconds / (60 * 60)); totalSeconds %= (60 * 60);
    const minutes = Math.floor(totalSeconds / 60);
    let parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0 && totalSeconds > 0) return "< 1m";
    if (parts.length === 0) return "Ended";
    return parts.join(' ');
}

// --- Core Fetching Functions ---

async function fetchL2Events<T extends ethers.BaseContract>(
    contract: T, eventName: string, cacheKey: keyof EventCache, cache: EventCache,
    l2Provider: ethers.providers.JsonRpcProvider, parser: (log: ethers.Event) => any,
    forceRange: { fromBlock: number, toBlock: number } | null = null
): Promise<number> { /* ... (no changes) ... */
    const latestBlock = forceRange ? forceRange.toBlock : await l2Provider.getBlockNumber();
    const fromBlock = forceRange ? forceRange.fromBlock : cache.lastL2BlockFetched + 1;
    const toBlock = latestBlock;
    if (fromBlock > toBlock) { console.log(chalk.gray(`Block range (${fromBlock}-${toBlock}) invalid or already covered for ${eventName} events.`)); return 0; }
    console.log(chalk.blue(`Fetching ${eventName} events from block ${fromBlock} to ${toBlock}...`));
    let addedCount = 0;
    try {
        const eventFilter = (contract.filters as any)[eventName]();
        if (!eventFilter) throw new Error(`Filter for event ${eventName} not found.`);
        const logs = await contract.queryFilter(eventFilter, fromBlock, toBlock);
        console.log(chalk.gray(`Found ${logs.length} ${eventName} events in range.`));
        const existingTxHashes = new Set((cache[cacheKey] as any[]).map(e => e.txHash));
        for (const log of logs) {
            if (existingTxHashes.has(log.transactionHash)) continue;
            try {
                const parsedData = parser(log);
                if (parsedData) { (cache[cacheKey] as any[]).push(parsedData); existingTxHashes.add(log.transactionHash); addedCount++; }
            } catch (e) { console.warn(chalk.yellow(`Could not parse ${eventName} log in tx ${log.transactionHash}: ${e}`)); }
        }
        console.log(chalk.gray(`Added ${addedCount} new unique ${eventName} events to cache.`));
    } catch (error) { console.error(chalk.red(`Error fetching ${eventName} events: ${error}`)); }
    if (!forceRange && toBlock > cache.lastL2BlockFetched) { cache.lastL2BlockFetched = toBlock; }
    else if (forceRange && toBlock > cache.lastL2BlockFetched) { cache.lastL2BlockFetched = toBlock; }
    return addedCount;
 }
async function findL1MessageSentInTx(l2Provider: ethers.providers.JsonRpcProvider, executionTxHash: string): Promise<L1MessageSentData | null> { /* ... (no changes) ... */
    console.log(chalk.blue(`Fetching receipt for L2 execution tx: ${executionTxHash}...`));
    try {
        const receipt = await l2Provider.getTransactionReceipt(executionTxHash);
        if (!receipt) { console.error(chalk.red(`Could not find transaction receipt for ${executionTxHash}`)); return null; }
        const l1MessengerInterface = new ethers.utils.Interface(L1_MESSENGER_ABI);
        const l1MessageSentTopic = l1MessengerInterface.getEventTopic('L1MessageSent');
        for (const log of receipt.logs) {
            if (log.address.toLowerCase() === L1_MESSENGER_ADDR.toLowerCase() && log.topics[0] === l1MessageSentTopic) {
                try {
                    const parsedLog = l1MessengerInterface.parseLog(log);
                    console.log(chalk.green('Found L1MessageSent event!'));
                    return { sender: parsedLog.args._sender, hash: parsedLog.args._hash, message: parsedLog.args._message, blockNumber: log.blockNumber, txHash: log.transactionHash };
                } catch (e) { console.warn(chalk.yellow(`Error parsing L1MessageSent log: ${e}`)); }
            }
        }
        console.warn(chalk.yellow(`L1MessageSent event not found in transaction ${executionTxHash}`)); return null;
    } catch (error) { console.error(chalk.red(`Error fetching tx receipt: ${error}`)); return null; }
 }
async function findL1UpgradeStarted(l1Provider: ethers.providers.JsonRpcProvider, upgradeHandlerContract: ethers.Contract, l1ProposalHash: string): Promise<UpgradeStartedData | null> { /* ... (no changes) ... */
    console.log(chalk.blue(`Searching for L1 UpgradeStarted event with ID: ${l1ProposalHash}...`));
    try {
        const eventFilter = upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash);
        const latestL1Block = await l1Provider.getBlockNumber();
        const fromBlockL1 = Math.max(0, latestL1Block - L1_EVENT_SEARCH_BLOCK_RANGE);
        console.log(chalk.gray(`Querying L1 blocks ${fromBlockL1} to ${latestL1Block}...`));
        const logs = await upgradeHandlerContract.queryFilter(eventFilter, fromBlockL1, latestL1Block);
        if (logs.length === 0) { console.warn(chalk.yellow(`UpgradeStarted event not found on L1 for ID ${l1ProposalHash} in the last ${L1_EVENT_SEARCH_BLOCK_RANGE} blocks.`)); return null; }
        if (logs.length > 1) { console.warn(chalk.yellow(`Found multiple (${logs.length}) UpgradeStarted events. Using first one.`)); }
        const log = logs[0];
        const parsedLog = upgradeHandlerContract.interface.parseLog(log);
        console.log(chalk.green('Found UpgradeStarted event on L1!'));
        const proposalData = parsedLog.args._proposal;
        const mappedProposal: UpgradeProposal = {
            calls: proposalData.calls.map((call: any) => ({ target: call.target, value: call.value, data: call.data })),
            executor: proposalData.executor, salt: proposalData.salt,
        };
        return { id: parsedLog.args._id, proposal: mappedProposal, blockNumber: log.blockNumber, txHash: log.transactionHash };
    } catch (error) { console.error(chalk.red(`Error searching for L1 UpgradeStarted event: ${error}`)); return null; }
 }
function decodeL1ProposalFromL2Calldata(l2Calldata: string): UpgradeProposal | null { /* ... (no changes) ... */
    if (!l2Calldata || !l2Calldata.startsWith(L2_MESSENGER_SEND_SELECTOR)) { console.warn(chalk.yellow(`L2 Calldata does not start with L1Messenger selector (${L2_MESSENGER_SEND_SELECTOR})`)); return null; }
    try {
        const encodedArgs = '0x' + l2Calldata.substring(L2_MESSENGER_SEND_SELECTOR.length);
        const decodedOuter = ethers.utils.defaultAbiCoder.decode(['bytes'], encodedArgs);
        const messageBytes = decodedOuter[0];
        const decodedInner = ethers.utils.defaultAbiCoder.decode([UPGRADE_PROPOSAL_TYPE], messageBytes);
        const proposalData = decodedInner[0];
        const mappedProposal: UpgradeProposal = {
            calls: proposalData.calls.map((call: any) => ({ target: call.target, value: call.value, data: call.data })),
            executor: proposalData.executor, salt: proposalData.salt,
        };
        return mappedProposal;
    } catch (e) { console.error(chalk.red(`Error decoding L1 proposal from L2 calldata: ${e}`)); console.error(chalk.red(`L2 Calldata was: ${l2Calldata}`)); return null; }
 }
function comparePayloads(l1PayloadFromL2: UpgradeProposal | null, l1PayloadFromEvent: UpgradeProposal | null): boolean { /* ... (no changes) ... */
    if (!l1PayloadFromL2 || !l1PayloadFromEvent) { console.error(chalk.red("Cannot compare payloads, one or both are missing.")); return false; }
    let mismatchFound = false;
    if (l1PayloadFromL2.executor.toLowerCase() !== l1PayloadFromEvent.executor.toLowerCase()) { console.error(chalk.red(`Mismatch: Executor L2(${l1PayloadFromL2.executor}) != L1(${l1PayloadFromEvent.executor})`)); mismatchFound = true; }
    if (l1PayloadFromL2.salt !== l1PayloadFromEvent.salt) { console.error(chalk.red(`Mismatch: Salt L2(${l1PayloadFromL2.salt}) != L1(${l1PayloadFromEvent.salt})`)); mismatchFound = true; }
    if (l1PayloadFromL2.calls.length !== l1PayloadFromEvent.calls.length) { console.error(chalk.red(`Mismatch: Call count L2(${l1PayloadFromL2.calls.length}) != L1(${l1PayloadFromEvent.calls.length})`)); return false; }
    for (let i = 0; i < l1PayloadFromL2.calls.length; i++) {
        const callL2 = l1PayloadFromL2.calls[i]; const callL1 = l1PayloadFromEvent.calls[i];
        if (callL2.target.toLowerCase() !== callL1.target.toLowerCase()) { console.error(chalk.red(`Mismatch (Call ${i}): Target L2(${callL2.target}) != L1(${callL1.target})`)); mismatchFound = true; }
        if (!ethers.BigNumber.from(callL2.value).eq(callL1.value)) { console.error(chalk.red(`Mismatch (Call ${i}): Value L2(${callL2.value.toString()}) != L1(${callL1.value.toString()})`)); mismatchFound = true; }
        if (callL2.data.toLowerCase() !== callL1.data.toLowerCase()) { console.error(chalk.red(`Mismatch (Call ${i}): Data L2(${callL2.data}) != L1(${callL1.data})`)); mismatchFound = true; }
    }
    return !mismatchFound;
 }

/**
 * Fetches the ProposalExtended event for a specific proposal ID.
 */
async function findProposalExtendedEvent(
    governorContract: ethers.Contract,
    proposalId: ethers.BigNumber,
    startBlock: number,
    cache: EventCache, // Pass cache to check first
    l2Provider: ethers.providers.JsonRpcProvider
): Promise<ProposalExtendedData | null> {
    // Check cache first
    const cachedEvent = cache.proposalExtendedEvents.find(e => e.proposalId.eq(proposalId));
    if (cachedEvent) {
        console.log(chalk.gray(`Found cached ProposalExtended event for ID ${proposalId.toString()}`));
        return cachedEvent;
    }

    console.log(chalk.blue(`Searching for ProposalExtended event for ID ${proposalId.toString()} from block ${startBlock}...`));
    try {
        const eventFilter = governorContract.filters.ProposalExtended(proposalId);
        const latestBlock = await l2Provider.getBlockNumber();
        // Query from startBlock (proposal creation) up to latest known block
        const logs = await governorContract.queryFilter(eventFilter, startBlock, latestBlock);

        if (logs.length === 0) {
            console.log(chalk.gray(`No ProposalExtended event found for ID ${proposalId.toString()}.`));
            return null;
        }

        if (logs.length > 1) {
            console.warn(chalk.yellow(`Found multiple (${logs.length}) ProposalExtended events for ID ${proposalId.toString()}. Using the first one.`));
        }

        const log = logs[0];
        const parsedLog = governorContract.interface.parseLog(log);
        const extendedData: ProposalExtendedData = {
            proposalId: parsedLog.args.proposalId,
            extendedDeadline: parsedLog.args.extendedDeadline,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash
        };
        console.log(chalk.green(`Found ProposalExtended event at block ${log.blockNumber}. New deadline: ${formatTimestamp(extendedData.extendedDeadline)}`));

        // Add to cache if not already there (shouldn't be due to check above, but good practice)
        if (!cache.proposalExtendedEvents.some(e => e.txHash === extendedData.txHash)) {
             cache.proposalExtendedEvents.push(extendedData);
        }
        return extendedData;

    } catch (error) {
        console.error(chalk.red(`Error searching for ProposalExtended event: ${error}`));
        return null;
    }
}


/**
 * Displays a text-based timeline of the proposal states with timing info.
 */
function displayTimeline(
    l2StateName: string,
    l1StateName: string | null,
    proposalCreated: ProposalCreatedData | null, // Needed for L2 voteEnd
    proposalExtended: ProposalExtendedData | null, // For extended deadline
    l1StatusData: UpgradeStatusData | null,
    // currentL2Block: ethers.BigNumber, // L2 block time is unreliable for time calc
    currentL1Timestamp: number // Use L1 timestamp as proxy for current time
) {
    console.log(chalk.bold('\n--- Proposal Timeline ---'));

    // --- L2 Timeline ---
    const l2States = ["Pending", "Active", "Succeeded", "Queued", "Executed"];
    const l2OffPathStates = ["Canceled", "Defeated", "Expired"];
    let currentL2Index = l2States.indexOf(l2StateName);
    let l2IsOffPath = l2OffPathStates.includes(l2StateName);

    // Determine effective L2 deadline
    const effectiveVoteEndTs = proposalExtended ? proposalExtended.extendedDeadline : proposalCreated?.voteEnd;

    let l2Timeline = chalk.bold("L2: ");
    l2States.forEach((state, index) => {
        let timingInfo = '';
        // Calculate time remaining for Active state based on effective end timestamp
        if (state === "Active" && l2StateName === "Active" && effectiveVoteEndTs && currentL1Timestamp > 0) {
            const secondsRemaining = effectiveVoteEndTs.toNumber() - currentL1Timestamp;
             timingInfo = chalk.cyan(` (${formatDuration(secondsRemaining)} left)`);
             if (secondsRemaining <= 0) timingInfo = chalk.cyan(` (Ended)`);
        }

        let coloredState = state;
        if (l2IsOffPath) { coloredState = chalk.gray(state); }
        else if (index < currentL2Index) { coloredState = chalk.gray(state); }
        else if (index === currentL2Index) { coloredState = chalk.green.bold(state); }
        else { coloredState = chalk.dim(state); }

        l2Timeline += coloredState + timingInfo + (index < l2States.length - 1 ? chalk.gray(' -> ') : '');
    });

    if (l2IsOffPath) { l2Timeline += chalk.red.bold(` -> ${l2StateName}`); }
    if (proposalExtended) { l2Timeline += chalk.blue(` [Extended]`); } // Indicate if extended
    console.log(l2Timeline);

    // --- Connector ---
    if (l2StateName === "Executed" && l1StateName) { console.log(chalk.cyan('    | L2 -> L1 Message Sent & Proven')); }
    else if (l2IsOffPath || l2StateName === "Expired") { console.log(chalk.red('    | Proposal Ended on L2')); }
    else if (l2StateName === "Queued" || l2StateName === "Succeeded") { console.log(chalk.gray('    | ... (Awaiting L2 Execution)')); }
    else { console.log(chalk.gray('    | ...')); }

    // --- L1 Timeline ---
    if (l1StateName && !l2IsOffPath) {
        const l1States = ["None", "LegalVetoPeriod", "Waiting", "ExecutionPending", "Ready", "Done"];
        const l1OffPathStates = ["Expired"];
        let currentL1Index = l1States.indexOf(l1StateName);
        let l1IsOffPath = l1OffPathStates.includes(l1StateName);
        if (l1StateName === "None") currentL1Index = 0;

        let l1Timeline = chalk.bold("L1: ");
        let nextArrow = true;

        let legalVetoEndTime = 0;
        let waitOrExpiryEndTime = 0;
        let readyTimestamp = 0;

        if (l1StatusData && l1StatusData.creationTimestamp > 0) {
            const vetoDuration = l1StatusData.guardiansExtendedLegalVeto ? L1_EXTENDED_LEGAL_VETO_SECONDS : L1_STANDARD_LEGAL_VETO_SECONDS;
            legalVetoEndTime = l1StatusData.creationTimestamp + vetoDuration;
            waitOrExpiryEndTime = legalVetoEndTime + L1_WAIT_OR_EXPIRE_SECONDS;
            if (l1StatusData.securityCouncilApprovalTimestamp > 0) {
                readyTimestamp = l1StatusData.securityCouncilApprovalTimestamp + L1_UPGRADE_DELAY_SECONDS;
            } else if (l1StatusData.guardiansApproval) {
                readyTimestamp = waitOrExpiryEndTime + L1_UPGRADE_DELAY_SECONDS;
            }
        }

        l1States.forEach((state, index) => {
            if (state === "None" && currentL1Index !== 0) return;

            let timingInfo = '';
            let secondsRemaining = -1;

            if (l1StatusData && currentL1Timestamp > 0) {
                if (state === "LegalVetoPeriod" && l1StateName === state && legalVetoEndTime > 0) {
                    secondsRemaining = legalVetoEndTime - currentL1Timestamp;
                    timingInfo = chalk.cyan(` (${formatDuration(secondsRemaining)} left)`);
                } else if (state === "Waiting" && l1StateName === state && waitOrExpiryEndTime > 0) {
                    secondsRemaining = waitOrExpiryEndTime - currentL1Timestamp;
                    timingInfo = chalk.cyan(` (~${formatDuration(secondsRemaining)} left until expiry/delay)`);
                } else if (state === "ExecutionPending" && l1StateName === state && readyTimestamp > 0) {
                    secondsRemaining = readyTimestamp - currentL1Timestamp;
                    timingInfo = chalk.cyan(` (~${formatDuration(secondsRemaining)} left until ready)`);
                } else if (state === "Ready" && l1StateName === state) {
                    timingInfo = chalk.cyan(` (Ready to Execute)`);
                } else if (state === "Done" && l1StateName === state) {
                    timingInfo = chalk.cyan(` (Executed)`);
                } else if (state === "Expired" && l1StateName === state) {
                    timingInfo = chalk.red(` (Expired)`);
                }
            }

            let coloredState = state;
            if (l1IsOffPath) { coloredState = chalk.gray(state); }
            else if (state === "None" && currentL1Index === 0) { coloredState = chalk.green.bold(state); }
            else if (currentL1Index === -1 || index < currentL1Index) { coloredState = chalk.gray(state); }
            else if (index === currentL1Index) { coloredState = chalk.green.bold(state); }
            else { coloredState = chalk.dim(state); }

            const isLastVisible = (index === l1States.length - 1) || (l1IsOffPath && state === "Ready");
            nextArrow = !isLastVisible;
            l1Timeline += coloredState + timingInfo + (nextArrow ? chalk.gray(' -> ') : '');
        });

        if (l1IsOffPath) { l1Timeline += chalk.red.bold(` -> ${l1StateName}`); }
        if (l1StatusData?.guardiansExtendedLegalVeto) { l1Timeline += chalk.blue(` [Veto Extended]`); } // Indicate if veto extended
        console.log(l1Timeline);

    } else if (!l2IsOffPath) {
        console.log(chalk.bold("L1: ") + chalk.dim("None (Awaiting L2->L1 Message Proof)"));
    }
}


// --- Main Execution ---
async function main() {
    // --- Argument Parsing ---
    const args = process.argv.slice(2);
    if (args.length !== 1) { console.error(chalk.red('Usage: ts-node governance-decoder.ts <l2_proposal_id>')); process.exit(1); }
    const l2ProposalIdInput = args[0];
    let l2ProposalId: ethers.BigNumber;
    try { l2ProposalId = ethers.BigNumber.from(l2ProposalIdInput); }
    catch (e) { console.error(chalk.red(`Invalid L2 Proposal ID format: ${l2ProposalIdInput}`)); process.exit(1); }

    console.log(chalk.bold.cyan(`--- ZKsync Era Governance Decoder ---`));
    console.log(chalk.cyan(`Analyzing L2 Proposal ID: ${l2ProposalId.toString()}`));

    // --- Provider & Contract Setup ---
    if (!ZKSYNC2_RPC_URL || !ETHEREUM_RPC_URL) { console.error(chalk.red('Error: ZKSYNC2_RPC_URL and ETHEREUM_RPC_URL must be set in the .env file.')); process.exit(1); }
    const l2Provider = new ethers.providers.JsonRpcProvider(ZKSYNC2_RPC_URL);
    const l1Provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
    const zkGovernor = new ethers.Contract(ZK_PROTOCOL_GOVERNOR_ADDR, ZK_PROTOCOL_GOVERNOR_ABI, l2Provider);
    const protocolUpgradeHandler = new ethers.Contract(PROTOCOL_UPGRADE_HANDLER_ADDR, PROTOCOL_UPGRADE_HANDLER_ABI, l1Provider);
    try { await l2Provider.getNetwork(); console.log(chalk.green(`Connected to ZKsync Era RPC: ${l2Provider.connection.url}`)); } catch (e) { console.error(chalk.red(`Failed L2 RPC connection: ${e}`)); process.exit(1); }
    try { await l1Provider.getNetwork(); console.log(chalk.green(`Connected to Ethereum L1 RPC: ${l1Provider.connection.url}`)); } catch (e) { console.error(chalk.red(`Failed L1 RPC connection: ${e}`)); process.exit(1); }

    // --- Fetch Current Block/Time ---
    // let currentL2Block = ethers.BigNumber.from(0); // Not reliable for time calculations
    let currentL1Timestamp = 0;
    // try { currentL2Block = await l2Provider.getBlockNumber(); } catch (e) { console.warn(chalk.yellow("Could not fetch current L2 block number.")); }
    try { currentL1Timestamp = (await l1Provider.getBlock('latest')).timestamp; } catch (e) { console.warn(chalk.yellow("Could not fetch current L1 timestamp.")); }


    // --- Load Cache ---
    const cache = loadCache();

    // --- 1. Fetch L2 ProposalCreated Data ---
    console.log(chalk.bold('\n--- Step 1: L2 Proposal Creation ---'));
    await fetchL2Events(zkGovernor, "ProposalCreated", "proposalCreatedEvents", cache, l2Provider, (log) => {
        const args = zkGovernor.interface.parseLog(log).args;
        return { proposalId: args.proposalId, proposer: args.proposer, targets: args.targets, values: args.values, signatures: args.signatures, calldatas: args.calldatas, voteStart: args.voteStart, voteEnd: args.voteEnd, description: args.description, blockNumber: log.blockNumber, txHash: log.transactionHash };
    });
    cache.proposalCreatedEvents.sort((a, b) => a.blockNumber - b.blockNumber);
    const proposalCreated = cache.proposalCreatedEvents.find(p => p.proposalId.eq(l2ProposalId));
    if (!proposalCreated) { console.error(chalk.red(`ProposalCreated event not found for ID ${l2ProposalId.toString()}.`)); saveCache(cache); process.exit(1); }

    console.log(chalk.green(`Found ProposalCreated event in L2 block ${proposalCreated.blockNumber} (Tx: ${proposalCreated.txHash})`));
    console.log(chalk.bold("L2 Proposal Details:"));
    console.log(`  Proposer: ${chalk.yellow(proposalCreated.proposer)}`);
    console.log(`  Vote Start Time: ${chalk.yellow(formatTimestamp(proposalCreated.voteStart))}`); // Changed label

    // --- Check for Vote Extension ---
    const proposalExtended = await findProposalExtendedEvent(zkGovernor, l2ProposalId, proposalCreated.blockNumber, cache, l2Provider);
    const effectiveVoteEndTs = proposalExtended ? proposalExtended.extendedDeadline : proposalCreated.voteEnd;
    console.log(`  Vote End Time:   ${chalk.yellow(formatTimestamp(effectiveVoteEndTs))}${proposalExtended ? chalk.blue(' (Extended)') : ''}`); // Changed label and added indicator

    console.log(`  Description:\n${chalk.italic.gray(proposalCreated.description.split('\n').map(l => `    ${l}`).join('\n'))}`);

    // --- Fetch L2 State, Votes, and Quorum ---
    let l2State = -1;
    let l2StateName = "Unknown";
    let votes = { againstVotes: ethers.BigNumber.from(0), forVotes: ethers.BigNumber.from(0), abstainVotes: ethers.BigNumber.from(0) };
    let quorumValue: ethers.BigNumber | null = null;
    try {
        l2State = await zkGovernor.state(l2ProposalId);
        l2StateName = mapL2State(l2State);
        console.log(`  L2 State: ${chalk.yellow(l2StateName)}`);
        votes = await zkGovernor.proposalVotes(l2ProposalId);
        // Quorum is based on voteStart *timestamp* (which acts as timepoint)
        quorumValue = await zkGovernor.quorum(proposalCreated.voteStart);
    } catch (e) { console.warn(chalk.yellow(`Could not fetch L2 state, votes, or quorum: ${e}`)); }

    // Display Votes and Quorum
    console.log(chalk.bold("L2 Votes:"));
    const totalVotes = votes.forVotes.add(votes.againstVotes).add(votes.abstainVotes);
    const forPercent = calculatePercentage(votes.forVotes, totalVotes);
    const againstPercent = calculatePercentage(votes.againstVotes, totalVotes);
    const abstainPercent = calculatePercentage(votes.abstainVotes, totalVotes);
    console.log(`  For:     ${chalk.green(formatUnits(votes.forVotes, VOTE_TOKEN_DECIMALS))} (${forPercent}%)`);
    console.log(`  Against: ${chalk.red(formatUnits(votes.againstVotes, VOTE_TOKEN_DECIMALS))} (${againstPercent}%)`);
    console.log(`  Abstain: ${chalk.gray(formatUnits(votes.abstainVotes, VOTE_TOKEN_DECIMALS))} (${abstainPercent}%)`);
    console.log(`  --------------------`);
    console.log(`  Total Voted: ${chalk.blue(formatUnits(totalVotes, VOTE_TOKEN_DECIMALS))}`);
    if (quorumValue) {
        const quorumPercentReached = calculatePercentage(votes.forVotes, quorumValue);
        console.log(`  Quorum:      ${chalk.magenta(formatUnits(quorumValue, VOTE_TOKEN_DECIMALS))} (Required at Vote Start)`);
        console.log(`  Quorum Reached: ${chalk.magenta(quorumPercentReached)}% (by For votes)`);
    } else { console.log(`  Quorum: ${chalk.yellow('Could not fetch quorum')}`); }

    // --- 2. Find L2 Execution and Extract L1 Message ---
    console.log(chalk.bold('\n--- Step 2: L2 Execution & L1 Message ---'));
    const latestL2Block = await l2Provider.getBlockNumber();
    await fetchL2Events(zkGovernor, "ProposalExecuted", "proposalExecutedEvents", cache, l2Provider, (log) => {
        const args = zkGovernor.interface.parseLog(log).args; return { proposalId: args.proposalId, blockNumber: log.blockNumber, txHash: log.transactionHash };
    }, { fromBlock: proposalCreated.blockNumber, toBlock: latestL2Block });
    cache.proposalExecutedEvents.sort((a, b) => a.blockNumber - b.blockNumber);
    const proposalExecuted = cache.proposalExecutedEvents.find(p => p.proposalId.eq(l2ProposalId));

    let l1MessageSent: L1MessageSentData | null = null;
    let l1ProposalHash: string | null = null;
    if (proposalExecuted) {
        console.log(chalk.green(`Found ProposalExecuted event in L2 block ${proposalExecuted.blockNumber} (Tx: ${proposalExecuted.txHash})`));
        l1MessageSent = await findL1MessageSentInTx(l2Provider, proposalExecuted.txHash);
        if (l1MessageSent) { l1ProposalHash = l1MessageSent.hash; console.log(chalk.bold(`L1 Proposal Identifier (Hash): ${chalk.yellow(l1ProposalHash)}`)); }
        else { console.error(chalk.red(`Failed L1MessageSent lookup for tx ${proposalExecuted.txHash}.`)); }
    } else { console.warn(chalk.yellow(`ProposalExecuted event not found for ID ${l2ProposalId.toString()}.`)); }

    // --- 3. Decode L1 Payload from L2 Data ---
    let l1PayloadFromL2: UpgradeProposal | null = null;
    const messengerCallIndex = (proposalCreated.targets ?? []).findIndex(t => t.toLowerCase() === L1_MESSENGER_ADDR.toLowerCase());
    if (messengerCallIndex !== -1) {
        const messengerCalldata = proposalCreated.calldatas?.[messengerCallIndex];
        if (messengerCalldata) { l1PayloadFromL2 = decodeL1ProposalFromL2Calldata(messengerCalldata); }
    }

    // --- 4. Fetch L1 Upgrade Data ---
    let upgradeStarted: UpgradeStartedData | null = null;
    let l1State = -1;
    let l1StateName: string | null = null;
    let l1StatusData: UpgradeStatusData | null = null;
    if (l1ProposalHash) {
        console.log(chalk.bold('\n--- Step 4: L1 Proposal Status ---'));
        upgradeStarted = await findL1UpgradeStarted(l1Provider, protocolUpgradeHandler, l1ProposalHash);
        try {
            l1State = await protocolUpgradeHandler.upgradeState(l1ProposalHash);
            l1StateName = mapL1State(l1State);
            l1StatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash);
        } catch (e) { console.warn(chalk.yellow(`Could not query L1 state/status for ${l1ProposalHash}: ${e}`)); }
        if (upgradeStarted) { console.log(chalk.green(`Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`)); }
        else { console.warn(chalk.yellow(`L1 UpgradeStarted event not found for ID ${l1ProposalHash}.`)); }
        console.log(`  L1 State: ${chalk.yellow(l1StateName ?? 'Unknown')}`);
        if (l1StatusData) {
             console.log(`  L1 Status:`);
             console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
             console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
             console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
             console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
             console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
        }
    } else { console.log(chalk.bold('\n--- Step 4: L1 Proposal Status ---')); console.log(chalk.gray("L1 Proposal Hash not found.")); }

    // --- Display Timeline ---
    // Pass effectiveVoteEndTs instead of proposalCreated directly for L2 timing
    displayTimeline(l2StateName, l1StateName, proposalCreated, proposalExtended, l1StatusData, currentL1Timestamp);

    // --- 5. Display Payloads & Compare ---
    console.log(chalk.bold('\n--- Step 5: L1 Payload Verification ---'));
    let payloadsMatch = false;
    if (l1PayloadFromL2 && upgradeStarted) {
        payloadsMatch = comparePayloads(l1PayloadFromL2, upgradeStarted.proposal);
    }

    // Display L1 Event Payload first (if available)
    if (upgradeStarted) {
        console.log(chalk.bold("L1 Payload (from UpgradeStarted Event):"));
        console.log(`  Executor: ${chalk.yellow(upgradeStarted.proposal.executor)}`);
        console.log(`  Salt: ${chalk.yellow(upgradeStarted.proposal.salt)}`);
        (upgradeStarted.proposal.calls ?? []).forEach((call, i) => {
            console.log(chalk.gray(`  Call ${i}:`)); console.log(`    Target: ${chalk.magenta(call.target)}`);
            console.log(`    Value: ${chalk.blue(formatValue(call.value))} ETH`); console.log(`    Data: ${chalk.yellow(call.data)}`);
        });
    } else if (l1PayloadFromL2) {
        // If L1 event not found, show the decoded L2 payload as the best available info
        console.log(chalk.bold("L1 Payload (Decoded from L2 Messenger Call - L1 Event Not Found):"));
        console.log(`  Executor: ${chalk.yellow(l1PayloadFromL2.executor)}`);
        console.log(`  Salt: ${chalk.yellow(l1PayloadFromL2.salt)}`);
        (l1PayloadFromL2.calls ?? []).forEach((call, i) => {
            console.log(chalk.gray(`  Call ${i}:`)); console.log(`    Target: ${chalk.magenta(call.target)}`);
            console.log(`    Value: ${chalk.blue(formatValue(call.value))} ETH`); console.log(`    Data: ${chalk.yellow(call.data)}`);
        });
    } else {
        console.log(chalk.yellow("No L1 payload information could be determined."));
    }

    // Display Decoded L2 Payload ONLY if it exists AND L1 event doesn't exist OR payloads mismatch
    if (l1PayloadFromL2 && (!upgradeStarted || !payloadsMatch)) {
         console.log(chalk.bold("\nL1 Payload (Decoded from L2 Messenger Call - Verification):"));
         if (!upgradeStarted) console.log(chalk.yellow("(Displaying because L1 UpgradeStarted event was not found)"));
         else if (!payloadsMatch) console.log(chalk.red("(Displaying because it differs from L1 UpgradeStarted event payload)"));

         console.log(`  Executor: ${chalk.yellow(l1PayloadFromL2.executor)}`);
         console.log(`  Salt: ${chalk.yellow(l1PayloadFromL2.salt)}`);
         (l1PayloadFromL2.calls ?? []).forEach((call, i) => {
             console.log(chalk.gray(`  Call ${i}:`)); console.log(`    Target: ${chalk.magenta(call.target)}`);
             console.log(`    Value: ${chalk.blue(formatValue(call.value))} ETH`); console.log(`    Data: ${chalk.yellow(call.data)}`);
         });
    }

    // Final comparison result message
    if (l1PayloadFromL2 && upgradeStarted) {
        if (payloadsMatch) { console.log(chalk.green('\nPayload Sanity Check Passed: L1 event payload matches decoded L2 messenger payload.')); }
        else { console.error(chalk.red('\nPayload Sanity Check Failed: Differences found!')); }
    } else if (l1ProposalHash) { console.warn(chalk.yellow("\nCould not perform payload comparison: L1 event data or decoded L2 payload is missing.")); }


    console.log(chalk.bold.cyan('\n--- Analysis Complete ---'));

    // --- Save Cache ---
    saveCache(cache);
}

// --- Run ---
main().catch((error) => {
    console.error(chalk.red('\n--- Script Error ---'));
    console.error(error);
    process.exit(1);
});
