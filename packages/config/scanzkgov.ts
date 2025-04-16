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
    "function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)",
    "function state(uint256 proposalId) view returns (uint8)" // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
];

const L1_MESSENGER_ABI = [
    "event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)"
];

const PROTOCOL_UPGRADE_HANDLER_ABI = [
    "event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)",
    "function upgradeState(bytes32 _id) view returns (uint8)", // 0:None, 1:LegalVeto, 2:Waiting, 3:ExecutionPending, 4:Ready, 5:Expired, 6:Done
    "function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)"
];

// --- Types and Interfaces ---
// ABI coder type definition for the UpgradeProposal struct
const UPGRADE_PROPOSAL_TYPE = "tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)";

interface Call {
    target: string;
    value: ethers.BigNumber;
    data: string;
}

interface UpgradeProposal {
    calls: Call[];
    executor: string;
    salt: string;
}

interface ProposalCreatedData {
    proposalId: ethers.BigNumber;
    proposer: string;
    targets: string[];
    values: ethers.BigNumber[];
    signatures: string[];
    calldatas: string[];
    voteStart: ethers.BigNumber;
    voteEnd: ethers.BigNumber;
    description: string;
    blockNumber: number;
    txHash: string;
}

interface ProposalExecutedData {
    proposalId: ethers.BigNumber;
    blockNumber: number;
    txHash: string;
}

interface L1MessageSentData {
    sender: string;
    hash: string; // This is the L1 Proposal ID
    message: string; // This contains the ABI-encoded UpgradeProposal
    blockNumber: number;
    txHash: string;
}

interface UpgradeStartedData {
    id: string; // L1 Proposal ID (_hash from L1MessageSent)
    proposal: UpgradeProposal; // Decoded directly from L1 event
    blockNumber: number;
    txHash: string;
}

interface UpgradeStatusData {
    creationTimestamp: number;
    securityCouncilApprovalTimestamp: number;
    guardiansApproval: boolean;
    guardiansExtendedLegalVeto: boolean;
    executed: boolean;
}

interface EventCache {
    lastL2BlockFetched: number; // Renamed for clarity
    proposalCreatedEvents: ProposalCreatedData[];
    proposalExecutedEvents: ProposalExecutedData[];
}

// --- Constants ---
const CACHE_FILE = path.join(__dirname, 'governance_event_cache.json');
const L1_EVENT_SEARCH_BLOCK_RANGE = 1_000_000; // Look back ~2 weeks on L1, adjust if needed
const L2_MESSENGER_SEND_SELECTOR = "0x62f84b24"; // Selector for sendMessageToL1(bytes)

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
            return cache;
        } catch (error) {
            console.warn(chalk.yellow(`Could not read cache file ${CACHE_FILE}: ${error}. Starting fresh.`));
        }
    }
    return { lastL2BlockFetched: 0, proposalCreatedEvents: [], proposalExecutedEvents: [] };
}

function saveCache(cache: EventCache): void {
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

function formatTimestamp(timestamp: number | ethers.BigNumber): string {
    if (!timestamp || ethers.BigNumber.from(timestamp).isZero()) return "N/A";
    try {
        const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000);
        return date.toLocaleString();
    } catch (e) {
        console.warn(chalk.yellow(`Could not format timestamp ${timestamp}: ${e}`));
        return "Invalid Date";
    }
}

function mapL2State(state: number): string {
    const states = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
    return states[state] ?? `Unknown (${state})`;
}

function mapL1State(state: number): string {
    const states = ["None", "LegalVetoPeriod", "Waiting", "ExecutionPending", "Ready", "Expired", "Done"];
    return states[state] ?? `Unknown (${state})`;
}

function formatValue(value: ethers.BigNumber | undefined | null): string {
     if (value === undefined || value === null) return 'N/A';
     try {
         return ethers.BigNumber.from(value).isZero() ? '0' : ethers.utils.formatEther(value);
     } catch (e) {
         return `Invalid (${value?.toString() ?? 'undefined'})`;
     }
}

// --- Core Fetching Functions ---

async function fetchL2Events<T extends ethers.BaseContract>(
    contract: T,
    eventName: string,
    cacheKey: keyof EventCache,
    cache: EventCache,
    l2Provider: ethers.providers.JsonRpcProvider,
    parser: (log: ethers.Event) => any, // Function to parse log into desired cache structure
    forceRange: { fromBlock: number, toBlock: number } | null = null // Optional range override
): Promise<number> {
    const latestBlock = forceRange ? forceRange.toBlock : await l2Provider.getBlockNumber();
    // Use forced range if provided, otherwise fetch since last cached block
    const fromBlock = forceRange ? forceRange.fromBlock : cache.lastL2BlockFetched + 1;
    const toBlock = latestBlock;

    if (fromBlock > toBlock) {
        console.log(chalk.gray(`Block range (${fromBlock}-${toBlock}) invalid or already covered for ${eventName} events.`));
        return 0; // No blocks to fetch or range invalid
    }

    console.log(chalk.blue(`Fetching ${eventName} events from block ${fromBlock} to ${toBlock}...`));

    let addedCount = 0;
    try {
        const eventFilter = (contract.filters as any)[eventName](); // Dynamically access filter
        if (!eventFilter) throw new Error(`Filter for event ${eventName} not found.`);

        const logs = await contract.queryFilter(eventFilter, fromBlock, toBlock);
        console.log(chalk.gray(`Found ${logs.length} ${eventName} events in range.`));

        const existingTxHashes = new Set((cache[cacheKey] as any[]).map(e => e.txHash));

        for (const log of logs) {
            if (existingTxHashes.has(log.transactionHash)) continue;
            try {
                const parsedData = parser(log); // Use the provided parser function
                if (parsedData) {
                     (cache[cacheKey] as any[]).push(parsedData);
                     existingTxHashes.add(log.transactionHash);
                     addedCount++;
                }
            } catch (e) {
                console.warn(chalk.yellow(`Could not parse ${eventName} log in tx ${log.transactionHash}: ${e}`));
            }
        }
        console.log(chalk.gray(`Added ${addedCount} new unique ${eventName} events to cache.`));

    } catch (error) {
        console.error(chalk.red(`Error fetching ${eventName} events: ${error}`));
    }

    // Update the main cache marker only if we weren't forcing a specific range AND we fetched up to date
    if (!forceRange && toBlock > cache.lastL2BlockFetched) {
        cache.lastL2BlockFetched = toBlock;
    } else if (forceRange && toBlock > cache.lastL2BlockFetched) {
        // If we forced a range (likely for ProposalExecuted), still update cache marker
        // to reflect overall progress, preventing redundant full scans later.
        cache.lastL2BlockFetched = toBlock;
    }

    return addedCount;
}

async function findL1MessageSentInTx(
    l2Provider: ethers.providers.JsonRpcProvider,
    executionTxHash: string
): Promise<L1MessageSentData | null> {
    console.log(chalk.blue(`Fetching receipt for L2 execution tx: ${executionTxHash}...`));
    try {
        const receipt = await l2Provider.getTransactionReceipt(executionTxHash);
        if (!receipt) {
            console.error(chalk.red(`Could not find transaction receipt for ${executionTxHash}`));
            return null;
        }

        const l1MessengerInterface = new ethers.utils.Interface(L1_MESSENGER_ABI);
        const l1MessageSentTopic = l1MessengerInterface.getEventTopic('L1MessageSent');

        for (const log of receipt.logs) {
            if (log.address.toLowerCase() === L1_MESSENGER_ADDR.toLowerCase() && log.topics[0] === l1MessageSentTopic) {
                try {
                    const parsedLog = l1MessengerInterface.parseLog(log);
                    console.log(chalk.green('Found L1MessageSent event!'));
                    return {
                        sender: parsedLog.args._sender,
                        hash: parsedLog.args._hash,
                        message: parsedLog.args._message, // Keep encoded message
                        blockNumber: log.blockNumber,
                        txHash: log.transactionHash
                    };
                } catch (e) {
                    console.warn(chalk.yellow(`Error parsing L1MessageSent log in tx ${log.transactionHash}: ${e}`));
                }
            }
        }
        console.warn(chalk.yellow(`L1MessageSent event not found in transaction ${executionTxHash}`));
        return null;
    } catch (error) {
        console.error(chalk.red(`Error fetching transaction receipt for ${executionTxHash}: ${error}`));
        return null;
    }
}

async function findL1UpgradeStarted(
    l1Provider: ethers.providers.JsonRpcProvider,
    upgradeHandlerContract: ethers.Contract,
    l1ProposalHash: string
): Promise<UpgradeStartedData | null> {
    console.log(chalk.blue(`Searching for L1 UpgradeStarted event with ID: ${l1ProposalHash}...`));
    try {
        const eventFilter = upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash);
        const latestL1Block = await l1Provider.getBlockNumber();
        const fromBlockL1 = Math.max(0, latestL1Block - L1_EVENT_SEARCH_BLOCK_RANGE);

        console.log(chalk.gray(`Querying L1 blocks ${fromBlockL1} to ${latestL1Block}...`));
        const logs = await upgradeHandlerContract.queryFilter(eventFilter, fromBlockL1, latestL1Block);

        if (logs.length === 0) {
            console.warn(chalk.yellow(`UpgradeStarted event not found on L1 for ID ${l1ProposalHash} in the last ${L1_EVENT_SEARCH_BLOCK_RANGE} blocks.`));
            return null;
        }
        if (logs.length > 1) {
            console.warn(chalk.yellow(`Found multiple (${logs.length}) UpgradeStarted events for ID ${l1ProposalHash}. Using first one.`));
        }

        const log = logs[0];
        const parsedLog = upgradeHandlerContract.interface.parseLog(log);
        console.log(chalk.green('Found UpgradeStarted event on L1!'));
        const proposalData = parsedLog.args._proposal;
        // Directly map to our UpgradeProposal interface
        const mappedProposal: UpgradeProposal = {
            calls: proposalData.calls.map((call: any) => ({
                target: call.target,
                value: call.value,
                data: call.data
            })),
            executor: proposalData.executor,
            salt: proposalData.salt,
        };
        return {
            id: parsedLog.args._id,
            proposal: mappedProposal,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash
        };
    } catch (error) {
        console.error(chalk.red(`Error searching for L1 UpgradeStarted event: ${error}`));
        return null;
    }
}

/**
 * Decodes the L1 UpgradeProposal struct from the L2 L1Messenger calldata's message.
 */
function decodeL1ProposalFromL2Calldata(l2Calldata: string): UpgradeProposal | null {
    if (!l2Calldata || !l2Calldata.startsWith(L2_MESSENGER_SEND_SELECTOR)) {
        console.warn(chalk.yellow(`L2 Calldata does not seem to be a call to L1Messenger (${L2_MESSENGER_SEND_SELECTOR})`));
        return null;
    }

    // Calldata structure for sendMessageToL1(bytes _message):
    // selector (4 bytes) + abi.encode(_message)
    // abi.encode(_message) itself for bytes is: offset (32 bytes) + length (32 bytes) + data (variable)
    const L2_CALLDATA_PREFIX_LENGTH = 4; // selector
    const L2_CALLDATA_OFFSET_LENGTH = 32;
    const L2_CALLDATA_LENGTH_LENGTH = 32;
    const BYTES_ARG_HEADER_LENGTH = L2_CALLDATA_OFFSET_LENGTH + L2_CALLDATA_LENGTH_LENGTH;

    try {
        // Remove selector
        const encodedArgs = '0x' + l2Calldata.substring(2 + L2_CALLDATA_PREFIX_LENGTH * 2);

        // Decode the outer `bytes` argument first to get the inner message bytes
        const decodedOuter = ethers.utils.defaultAbiCoder.decode(['bytes'], encodedArgs);
        const messageBytes = decodedOuter[0];

        // Now decode the inner message bytes using the known struct type
        const decodedInner = ethers.utils.defaultAbiCoder.decode([UPGRADE_PROPOSAL_TYPE], messageBytes);

        // Structure the result according to our interface
        const proposalData = decodedInner[0]; // The decoded tuple is the first element
         const mappedProposal: UpgradeProposal = {
            calls: proposalData.calls.map((call: any) => ({
                target: call.target,
                value: call.value,
                data: call.data
            })),
            executor: proposalData.executor,
            salt: proposalData.salt,
        };

        return mappedProposal;

    } catch (e) {
        console.error(chalk.red(`Error decoding L1 proposal from L2 calldata: ${e}`));
        console.error(chalk.red(`L2 Calldata was: ${l2Calldata}`));
        return null;
    }
}

/**
 * Compares the L1 payload sourced from L2 and the one from the L1 event.
 */
function comparePayloads(l1PayloadFromL2: UpgradeProposal | null, l1PayloadFromEvent: UpgradeProposal | null): boolean {
    if (!l1PayloadFromL2 || !l1PayloadFromEvent) {
        console.error(chalk.red("Cannot compare payloads, one or both are missing."));
        return false;
    }

    let mismatchFound = false;

    // Compare executor
    if (l1PayloadFromL2.executor.toLowerCase() !== l1PayloadFromEvent.executor.toLowerCase()) {
        console.error(chalk.red(`Mismatch: Executor L2(${l1PayloadFromL2.executor}) != L1(${l1PayloadFromEvent.executor})`));
        mismatchFound = true;
    }

    // Compare salt
    if (l1PayloadFromL2.salt !== l1PayloadFromEvent.salt) {
        console.error(chalk.red(`Mismatch: Salt L2(${l1PayloadFromL2.salt}) != L1(${l1PayloadFromEvent.salt})`));
        mismatchFound = true;
    }

    // Compare calls array length
    if (l1PayloadFromL2.calls.length !== l1PayloadFromEvent.calls.length) {
        console.error(chalk.red(`Mismatch: Number of calls L2(${l1PayloadFromL2.calls.length}) != L1(${l1PayloadFromEvent.calls.length})`));
        return false; // Cannot compare individual calls if lengths differ
    }

    // Compare individual calls
    for (let i = 0; i < l1PayloadFromL2.calls.length; i++) {
        const callL2 = l1PayloadFromL2.calls[i];
        const callL1 = l1PayloadFromEvent.calls[i];

        if (callL2.target.toLowerCase() !== callL1.target.toLowerCase()) {
            console.error(chalk.red(`Mismatch (Call ${i}): Target L2(${callL2.target}) != L1(${callL1.target})`));
            mismatchFound = true;
        }
        if (!ethers.BigNumber.from(callL2.value).eq(callL1.value)) {
            console.error(chalk.red(`Mismatch (Call ${i}): Value L2(${callL2.value.toString()}) != L1(${callL1.value.toString()})`));
            mismatchFound = true;
        }
         if (callL2.data.toLowerCase() !== callL1.data.toLowerCase()) {
            console.error(chalk.red(`Mismatch (Call ${i}): Data L2(${callL2.data}) != L1(${callL1.data})`));
            mismatchFound = true;
        }
    }

    return !mismatchFound;
}

// --- Main Execution ---
async function main() {
    // --- Argument Parsing ---
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error(chalk.red('Usage: ts-node governance-decoder.ts <l2_proposal_id>'));
        process.exit(1);
    }
    const l2ProposalIdInput = args[0];
    let l2ProposalId: ethers.BigNumber;
    try {
        l2ProposalId = ethers.BigNumber.from(l2ProposalIdInput);
    } catch (e) {
        console.error(chalk.red(`Invalid L2 Proposal ID format: ${l2ProposalIdInput}`));
        process.exit(1);
    }

    console.log(chalk.bold.cyan(`--- ZKsync Era Governance Decoder ---`));
    console.log(chalk.cyan(`Analyzing L2 Proposal ID: ${l2ProposalId.toString()}`));

    // --- Provider & Contract Setup ---
    if (!ZKSYNC2_RPC_URL || !ETHEREUM_RPC_URL) {
        console.error(chalk.red('Error: ZKSYNC2_RPC_URL and ETHEREUM_RPC_URL must be set in the .env file.'));
        process.exit(1);
    }

    const l2Provider = new ethers.providers.JsonRpcProvider(ZKSYNC2_RPC_URL);
    const l1Provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
    const zkGovernor = new ethers.Contract(ZK_PROTOCOL_GOVERNOR_ADDR, ZK_PROTOCOL_GOVERNOR_ABI, l2Provider);
    const protocolUpgradeHandler = new ethers.Contract(PROTOCOL_UPGRADE_HANDLER_ADDR, PROTOCOL_UPGRADE_HANDLER_ABI, l1Provider);

    try { await l2Provider.getNetwork(); console.log(chalk.green(`Connected to ZKsync Era RPC: ${l2Provider.connection.url}`)); }
    catch (e) { console.error(chalk.red(`Failed to connect to ZKsync Era RPC: ${e}`)); process.exit(1); }
    try { await l1Provider.getNetwork(); console.log(chalk.green(`Connected to Ethereum L1 RPC: ${l1Provider.connection.url}`)); }
    catch (e) { console.error(chalk.red(`Failed to connect to Ethereum L1 RPC: ${e}`)); process.exit(1); }

    // --- Load Cache ---
    const cache = loadCache();

    // --- 1. Fetch L2 ProposalCreated Data ---
    console.log(chalk.bold('\n--- Step 1: Fetching L2 Proposal Creation Data ---'));
    await fetchL2Events(
        zkGovernor,
        "ProposalCreated",
        "proposalCreatedEvents",
        cache,
        l2Provider,
        (log) => { // Parser function
            const args = zkGovernor.interface.parseLog(log).args;
            return {
                proposalId: args.proposalId, proposer: args.proposer, targets: args.targets,
                values: args.values, signatures: args.signatures, calldatas: args.calldatas,
                voteStart: args.voteStart, voteEnd: args.voteEnd, description: args.description,
                blockNumber: log.blockNumber, txHash: log.transactionHash
            };
        }
    );
    cache.proposalCreatedEvents.sort((a, b) => a.blockNumber - b.blockNumber); // Sort for consistency
    const proposalCreated = cache.proposalCreatedEvents.find(p => p.proposalId.eq(l2ProposalId));

    if (!proposalCreated) {
        console.error(chalk.red(`ProposalCreated event not found for ID ${l2ProposalId.toString()} in cached/fetched data.`));
        saveCache(cache);
        process.exit(1);
    }

    console.log(chalk.green(`Found ProposalCreated event in L2 block ${proposalCreated.blockNumber} (Tx: ${proposalCreated.txHash})`));
    console.log(chalk.bold("\nL2 Proposal Details:"));
    console.log(`  Proposer: ${chalk.yellow(proposalCreated.proposer)}`);
    console.log(`  Vote Start: ${chalk.yellow(formatTimestamp(proposalCreated.voteStart))} (${proposalCreated.voteStart.toString()})`);
    console.log(`  Vote End: ${chalk.yellow(formatTimestamp(proposalCreated.voteEnd))} (${proposalCreated.voteEnd.toString()})`);
    console.log(`  Description:\n${chalk.italic.gray(proposalCreated.description.split('\n').map(l => `    ${l}`).join('\n'))}`);

    // Fetch L2 State and Votes
    try {
        const l2State = await zkGovernor.state(l2ProposalId);
        console.log(`  L2 State: ${chalk.yellow(mapL2State(l2State))}`);
        const votes = await zkGovernor.proposalVotes(l2ProposalId);
        console.log(`  Votes For: ${chalk.green(ethers.utils.formatUnits(votes.forVotes, 18))}`); // Assuming 18 decimals
        console.log(`  Votes Against: ${chalk.red(ethers.utils.formatUnits(votes.againstVotes, 18))}`);
        console.log(`  Votes Abstain: ${chalk.gray(ethers.utils.formatUnits(votes.abstainVotes, 18))}`);
    } catch (e) { console.warn(chalk.yellow(`Could not fetch L2 state or votes: ${e}`)); }

    // Display L2 Raw Payload Calls (still useful for context)
    console.log(chalk.bold("\nL2 Raw Proposal Actions:"));
    (proposalCreated.targets ?? []).forEach((target, i) => {
        console.log(chalk.gray(`  Action ${i}:`));
        console.log(`    Target: ${chalk.magenta(target)}`);
        console.log(`    Value: ${chalk.blue(formatValue(proposalCreated.values?.[i]))} ETH`);
        console.log(`    Signature: ${chalk.cyan(proposalCreated.signatures?.[i] || 'N/A')}`);
        console.log(`    Calldata: ${chalk.yellow(proposalCreated.calldatas?.[i] || '0x')}`);
    });

    // --- 2. Find L2 Execution and Extract L1 Message ---
    console.log(chalk.bold('\n--- Step 2: Finding L2 Execution & L1 Message ---'));
    const latestL2Block = await l2Provider.getBlockNumber();
    await fetchL2Events(
        zkGovernor,
        "ProposalExecuted",
        "proposalExecutedEvents",
        cache,
        l2Provider,
        (log) => { // Parser function
            const args = zkGovernor.interface.parseLog(log).args;
            return { proposalId: args.proposalId, blockNumber: log.blockNumber, txHash: log.transactionHash };
        },
        { fromBlock: proposalCreated.blockNumber, toBlock: latestL2Block } // Force range check
    );
    cache.proposalExecutedEvents.sort((a, b) => a.blockNumber - b.blockNumber);
    const proposalExecuted = cache.proposalExecutedEvents.find(p => p.proposalId.eq(l2ProposalId));

    if (!proposalExecuted) {
        console.warn(chalk.yellow(`ProposalExecuted event not found for ID ${l2ProposalId.toString()} after checking range from creation block.`));
        saveCache(cache);
        process.exit(0);
    }

    console.log(chalk.green(`Found ProposalExecuted event in L2 block ${proposalExecuted.blockNumber} (Tx: ${proposalExecuted.txHash})`));
    const l1MessageSent = await findL1MessageSentInTx(l2Provider, proposalExecuted.txHash);

    if (!l1MessageSent) {
        console.error(chalk.red(`Failed to find L1MessageSent event associated with execution tx ${proposalExecuted.txHash}.`));
        saveCache(cache);
        process.exit(1);
    }

    const l1ProposalHash = l1MessageSent.hash;
    console.log(chalk.bold(`\nL1 Proposal Identifier (Hash): ${chalk.yellow(l1ProposalHash)}`));

    // --- 3. Decode L1 Payload from L2 Data ---
    console.log(chalk.bold('\n--- Step 3: Decoding L1 Payload from L2 Messenger Call ---'));
    let l1PayloadFromL2: UpgradeProposal | null = null;
    const messengerCallIndex = (proposalCreated.targets ?? []).findIndex(t => t.toLowerCase() === L1_MESSENGER_ADDR.toLowerCase());

    if (messengerCallIndex !== -1) {
        const messengerCalldata = proposalCreated.calldatas?.[messengerCallIndex];
        if (messengerCalldata) {
            l1PayloadFromL2 = decodeL1ProposalFromL2Calldata(messengerCalldata);
            if (l1PayloadFromL2) {
                 console.log(chalk.green("Successfully decoded L1 payload from L2 calldata:"));
                 console.log(`  Executor: ${chalk.yellow(l1PayloadFromL2.executor)}`);
                 console.log(`  Salt: ${chalk.yellow(l1PayloadFromL2.salt)}`);
                 l1PayloadFromL2.calls.forEach((call, i) => {
                     console.log(chalk.gray(`  Call ${i}:`));
                     console.log(`    Target: ${chalk.magenta(call.target)}`);
                     console.log(`    Value: ${chalk.blue(formatValue(call.value))} ETH`);
                     console.log(`    Data: ${chalk.yellow(call.data)}`);
                 });
            }
        } else {
             console.warn(chalk.yellow("Found L1Messenger target in L2 actions, but calldata is missing."));
        }
    } else {
         console.warn(chalk.yellow("L2 Proposal actions do not include a call to L1Messenger. Cannot extract L1 payload from L2."));
    }

    // --- 4. Fetch L1 Upgrade Data ---
    console.log(chalk.bold('\n--- Step 4: Fetching L1 Upgrade Data ---'));
    const upgradeStarted = await findL1UpgradeStarted(l1Provider, protocolUpgradeHandler, l1ProposalHash);

    // Fetch L1 Status/State (always try)
    let l1StateStr = 'Unknown';
    let l1StatusData: UpgradeStatusData | null = null;
    try {
        const l1StateNum = await protocolUpgradeHandler.upgradeState(l1ProposalHash);
        l1StateStr = mapL1State(l1StateNum);
        l1StatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash);
    } catch (e) { console.warn(chalk.yellow(`Could not query L1 state/status for ${l1ProposalHash}: ${e}`)); }

    if (!upgradeStarted) {
        console.warn(chalk.yellow(`L1 UpgradeStarted event not found for ID ${l1ProposalHash}.`));
        if (l1StatusData) { // Still display status if found
             console.log(`  L1 State (queried): ${chalk.yellow(l1StateStr)}`);
             console.log(`  L1 Status (queried):`);
             console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
             // ... other status fields
             console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
        }
        saveCache(cache);
        process.exit(0);
    }

    // --- Display L1 Event Data ---
    console.log(chalk.green(`Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`));
    console.log(`  L1 State: ${chalk.yellow(l1StateStr)}`);
    if (l1StatusData) {
         console.log(`  L1 Status:`);
         console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
         console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
         console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
         console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
         console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
    }
    console.log(chalk.bold("\nL1 Proposal Details (from UpgradeStarted Event):"));
    console.log(`  Executor: ${chalk.yellow(upgradeStarted.proposal.executor)}`);
    console.log(`  Salt: ${chalk.yellow(upgradeStarted.proposal.salt)}`);
    console.log(chalk.bold("\nL1 Payload (from UpgradeStarted Event):"));
    (upgradeStarted.proposal.calls ?? []).forEach((call, i) => {
        console.log(chalk.gray(`  Call ${i}:`));
        console.log(`    Target: ${chalk.magenta(call.target)}`);
        console.log(`    Value: ${chalk.blue(formatValue(call.value))} ETH`);
        console.log(`    Data: ${chalk.yellow(call.data)}`);
    });

    // --- 5. Sanity Check Payloads ---
    console.log(chalk.bold('\n--- Step 5: Comparing L1 Event Payload vs. Decoded L2 Messenger Payload ---'));
    if (l1PayloadFromL2 && upgradeStarted) {
        const payloadsMatch = comparePayloads(l1PayloadFromL2, upgradeStarted.proposal);
        if (payloadsMatch) {
             console.log(chalk.green('Payload Sanity Check Passed: L1 event payload matches decoded L2 messenger payload.'));
        } else {
             console.error(chalk.red('Payload Sanity Check Failed: Differences found between L1 event payload and decoded L2 messenger payload!'));
        }
    } else {
         console.warn(chalk.yellow("Could not perform payload comparison: L1 event data or decoded L2 payload is missing."));
    }

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
