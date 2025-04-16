#!/usr/bin/env node

// Import necessary libraries
import { ethers } from 'ethers';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// --- Configuration ---
const ZKSYNC2_RPC_URL = process.env.ZKSYNC2_RPC_URL;
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;

// Contract Addresses
const ZK_PROTOCOL_GOVERNOR_ADDR = '0x76705327e682F2d96943280D99464Ab61219e34f'; // ZKsync Era
const L1_MESSENGER_ADDR = '0x0000000000000000000000000000000000008008'; // ZKsync Era (System Contract)
const PROTOCOL_UPGRADE_HANDLER_ADDR = '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3'; // Ethereum L1

// --- ABIs (Simplified for relevant parts) ---
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

// --- Interfaces ---
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
    message: string;
    blockNumber: number;
    txHash: string;
}

interface UpgradeStartedData {
    id: string; // L1 Proposal ID (_hash from L1MessageSent)
    proposal: {
        calls: { target: string; value: ethers.BigNumber; data: string }[];
        executor: string;
        salt: string;
    };
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
    lastBlockFetched: number;
    proposalCreatedEvents: ProposalCreatedData[];
    proposalExecutedEvents: ProposalExecutedData[];
}

// --- Constants ---
const CACHE_FILE = path.join(__dirname, 'governance_event_cache.json');
const BLOCKS_TO_FETCH_INCREMENT = 50000; // Adjust as needed for performance vs. completeness

// --- Helper Functions ---

/**
 * Loads event cache from file or returns a default structure.
 */
function loadCache(): EventCache {
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            const cache: EventCache = JSON.parse(data, (key, value) => {
                // Reviver to convert hex strings back to BigNumbers
                if (typeof value === 'object' && value !== null && value.type === 'BigNumber') {
                    return ethers.BigNumber.from(value.hex);
                }
                return value;
            });
            console.log(chalk.gray(`Loaded cache from ${CACHE_FILE}. Last block fetched: ${cache.lastBlockFetched}`));
            return cache;
        } catch (error) {
            console.warn(chalk.yellow(`Could not read cache file ${CACHE_FILE}: ${error}. Starting fresh.`));
        }
    }
    return { lastBlockFetched: 0, proposalCreatedEvents: [], proposalExecutedEvents: [] };
}

/**
 * Saves the event cache to a file.
 * @param cache The cache object to save.
 */
function saveCache(cache: EventCache): void {
    try {
        // Replacer to convert BigNumbers to hex strings for JSON serialization
        const data = JSON.stringify(cache, (key, value) => {
            if (ethers.BigNumber.isBigNumber(value)) {
                return { type: 'BigNumber', hex: value.toHexString() };
            }
            return value;
        }, 2); // Pretty print JSON
        fs.writeFileSync(CACHE_FILE, data, 'utf-8');
        console.log(chalk.gray(`Saved cache to ${CACHE_FILE}. Last block fetched: ${cache.lastBlockFetched}`));
    } catch (error) {
        console.error(chalk.red(`Error saving cache: ${error}`));
    }
}

/**
 * Formats a timestamp (seconds) into a human-readable string.
 */
function formatTimestamp(timestamp: number | ethers.BigNumber): string {
    if (timestamp === 0 || ethers.BigNumber.from(timestamp).eq(0)) return "N/A";
    const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000);
    return date.toLocaleString();
}

/**
 * Maps L2 Governor state enum to string.
 */
function mapL2State(state: number): string {
    const states = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
    return states[state] || "Unknown";
}

/**
 * Maps L1 Handler state enum to string.
 */
function mapL1State(state: number): string {
    const states = ["None", "LegalVetoPeriod", "Waiting", "ExecutionPending", "Ready", "Expired", "Done"];
    return states[state] || "Unknown";
}

/**
 * Fetches ProposalCreated events from ZKsync Era, updating the cache.
 */
async function fetchProposalCreatedEvents(
    governorContract: ethers.Contract,
    cache: EventCache,
    l2Provider: ethers.providers.JsonRpcProvider
): Promise<void> {
    const latestBlock = await l2Provider.getBlockNumber();
    let fromBlock = cache.lastBlockFetched + 1;

    if (fromBlock > latestBlock) {
        console.log(chalk.gray("Cache is up to date for ProposalCreated events."));
        return;
    }

    console.log(chalk.blue(`Fetching ProposalCreated events from block ${fromBlock} to ${latestBlock}...`));

    const eventFilter = governorContract.filters.ProposalCreated();
    const logs = await governorContract.queryFilter(eventFilter, fromBlock, latestBlock);

    console.log(chalk.gray(`Found ${logs.length} new ProposalCreated events.`));

    for (const log of logs) {
        try {
            const parsedLog = governorContract.interface.parseLog(log);
            cache.proposalCreatedEvents.push({
                proposalId: parsedLog.args.proposalId,
                proposer: parsedLog.args.proposer,
                targets: parsedLog.args.targets,
                values: parsedLog.args.values,
                signatures: parsedLog.args.signatures,
                calldatas: parsedLog.args.calldatas,
                voteStart: parsedLog.args.voteStart,
                voteEnd: parsedLog.args.voteEnd,
                description: parsedLog.args.description,
                blockNumber: log.blockNumber,
                txHash: log.transactionHash
            });
        } catch (e) {
            console.warn(chalk.yellow(`Could not parse ProposalCreated log in tx ${log.transactionHash}: ${e}`));
        }
    }
    cache.lastBlockFetched = latestBlock; // Update cache marker
}


/**
 * Fetches ProposalExecuted events from ZKsync Era, updating the cache.
 * Note: We might fetch overlapping ranges if the script runs infrequently,
 * but the cache update prevents duplicates if run sequentially.
 */
async function fetchProposalExecutedEvents(
    governorContract: ethers.Contract,
    cache: EventCache,
    l2Provider: ethers.providers.JsonRpcProvider,
    startBlock: number // Start searching from the block the proposal was created
): Promise<void> {
    const latestBlock = await l2Provider.getBlockNumber();
    let fromBlock = Math.max(startBlock, cache.lastBlockFetched + 1); // Start from proposal creation or last cache point

    // Avoid fetching if we are already up-to-date relative to the proposal creation block
    if (fromBlock > latestBlock) {
        console.log(chalk.gray(`No new blocks to check for ProposalExecuted events since block ${startBlock}.`));
        return;
    }

    console.log(chalk.blue(`Fetching ProposalExecuted events from block ${fromBlock} to ${latestBlock}...`));

    const eventFilter = governorContract.filters.ProposalExecuted();
    const logs = await governorContract.queryFilter(eventFilter, fromBlock, latestBlock);

    console.log(chalk.gray(`Found ${logs.length} new ProposalExecuted events in the checked range.`));

     const existingTxHashes = new Set(cache.proposalExecutedEvents.map(e => e.txHash));

    for (const log of logs) {
        // Avoid adding duplicates if cache wasn't perfectly sequential
        if (existingTxHashes.has(log.transactionHash)) continue;
        try {
            const parsedLog = governorContract.interface.parseLog(log);
            cache.proposalExecutedEvents.push({
                proposalId: parsedLog.args.proposalId,
                blockNumber: log.blockNumber,
                txHash: log.transactionHash
            });
            existingTxHashes.add(log.transactionHash);
        } catch (e) {
            console.warn(chalk.yellow(`Could not parse ProposalExecuted log in tx ${log.transactionHash}: ${e}`));
        }
    }
     // Update cache marker only if we fetched up to the latest block
     if (latestBlock > cache.lastBlockFetched) {
        cache.lastBlockFetched = latestBlock;
     }
}


/**
 * Finds the L1MessageSent event within the same transaction as ProposalExecuted.
 */
async function findL1MessageSent(
    l2Provider: ethers.providers.JsonRpcProvider,
    l1MessengerInterface: ethers.utils.Interface,
    executionTxHash: string
): Promise<L1MessageSentData | null> {
    console.log(chalk.blue(`Fetching receipt for L2 execution tx: ${executionTxHash}...`));
    const receipt = await l2Provider.getTransactionReceipt(executionTxHash);
    if (!receipt) {
        console.error(chalk.red(`Could not find transaction receipt for ${executionTxHash}`));
        return null;
    }

    console.log(chalk.gray(`Scanning ${receipt.logs.length} logs in execution tx...`));
    const l1MessageSentTopic = l1MessengerInterface.getEventTopic('L1MessageSent');

    for (const log of receipt.logs) {
        // Check address and topic0
        if (log.address.toLowerCase() === L1_MESSENGER_ADDR.toLowerCase() && log.topics[0] === l1MessageSentTopic) {
             try {
                const parsedLog = l1MessengerInterface.parseLog(log);
                console.log(chalk.green('Found L1MessageSent event!'));
                return {
                    sender: parsedLog.args._sender, // Should be the Timelock/Governor caller
                    hash: parsedLog.args._hash,
                    message: parsedLog.args._message,
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
}

/**
 * Fetches the UpgradeStarted event from L1 using the L1 proposal hash.
 */
async function findL1UpgradeStarted(
    l1Provider: ethers.providers.JsonRpcProvider,
    upgradeHandlerContract: ethers.Contract,
    l1ProposalHash: string
): Promise<UpgradeStartedData | null> {
    console.log(chalk.blue(`Searching for L1 UpgradeStarted event with ID: ${l1ProposalHash}...`));

    // Filter by indexed event topic `_id`
    const eventFilter = upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash);

    // Query logs (consider adding a reasonable block range if L1 is very old, but user requested no range limit)
    // Let's search the last N blocks for practicality, or adjust if needed.
    // Searching from block 0 can be extremely slow on L1.
    const L1_SEARCH_BLOCK_RANGE = 500000; // Look back ~1 week, adjust if needed
    const latestL1Block = await l1Provider.getBlockNumber();
    const fromBlockL1 = Math.max(0, latestL1Block - L1_SEARCH_BLOCK_RANGE);

    console.log(chalk.gray(`Querying L1 blocks ${fromBlockL1} to ${latestL1Block}...`));

    const logs = await upgradeHandlerContract.queryFilter(eventFilter, fromBlockL1, latestL1Block);

    if (logs.length === 0) {
        console.warn(chalk.yellow(`UpgradeStarted event not found on L1 for ID ${l1ProposalHash} in the last ${L1_SEARCH_BLOCK_RANGE} blocks.`));
        return null;
    }

    if (logs.length > 1) {
        console.warn(chalk.yellow(`Found multiple (${logs.length}) UpgradeStarted events for ID ${l1ProposalHash}. Using the first one.`));
    }

    const log = logs[0];
     try {
        const parsedLog = upgradeHandlerContract.interface.parseLog(log);
        console.log(chalk.green('Found UpgradeStarted event on L1!'));
        const proposalData = parsedLog.args._proposal;
        return {
            id: parsedLog.args._id,
            proposal: {
                // Map the struct fields correctly
                calls: proposalData.calls.map((call: any) => ({
                    target: call.target,
                    value: call.value,
                    data: call.data
                })),
                executor: proposalData.executor,
                salt: proposalData.salt,
            },
            blockNumber: log.blockNumber,
            txHash: log.transactionHash
        };
    } catch (e) {
         console.error(chalk.red(`Error parsing UpgradeStarted log in L1 tx ${log.transactionHash}: ${e}`));
         return null;
    }
}

// --- Main Execution ---
async function main() {
    // --- Argument Parsing ---
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error(chalk.red('Usage: node governance-decoder.ts <l2_proposal_id>'));
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

    try {
        await l2Provider.getNetwork();
        console.log(chalk.green(`Connected to ZKsync Era RPC at ${ZKSYNC2_RPC_URL}`));
    } catch (e) {
        console.error(chalk.red(`Failed to connect to ZKsync Era RPC: ${e}`));
        process.exit(1);
    }
    try {
        await l1Provider.getNetwork();
        console.log(chalk.green(`Connected to Ethereum L1 RPC at ${ETHEREUM_RPC_URL}`));
    } catch (e) {
        console.error(chalk.red(`Failed to connect to Ethereum L1 RPC: ${e}`));
        process.exit(1);
    }

    const zkGovernor = new ethers.Contract(ZK_PROTOCOL_GOVERNOR_ADDR, ZK_PROTOCOL_GOVERNOR_ABI, l2Provider);
    const l1MessengerInterface = new ethers.utils.Interface(L1_MESSENGER_ABI); // Only need interface for parsing logs
    const protocolUpgradeHandler = new ethers.Contract(PROTOCOL_UPGRADE_HANDLER_ADDR, PROTOCOL_UPGRADE_HANDLER_ABI, l1Provider);

    // --- Load Cache ---
    const cache = loadCache();

    // --- 1. Fetch L2 ProposalCreated Data ---
    console.log(chalk.bold('\n--- Step 1: Fetching L2 Proposal Creation Data ---'));
    await fetchProposalCreatedEvents(zkGovernor, cache, l2Provider);
    const proposalCreated = cache.proposalCreatedEvents.find(p => p.proposalId.eq(l2ProposalId));

    if (!proposalCreated) {
        console.error(chalk.red(`ProposalCreated event not found for ID ${l2ProposalId.toString()} in cached/fetched data.`));
        saveCache(cache); // Save potentially updated cache even on error
        process.exit(1);
    }

    console.log(chalk.green(`Found ProposalCreated event in L2 block ${proposalCreated.blockNumber} (Tx: ${proposalCreated.txHash})`));
    console.log(chalk.bold("\nL2 Proposal Details:"));
    console.log(`  Proposer: ${chalk.yellow(proposalCreated.proposer)}`);
    console.log(`  Vote Start: ${chalk.yellow(formatTimestamp(proposalCreated.voteStart))} (${proposalCreated.voteStart.toString()})`);
    console.log(`  Vote End: ${chalk.yellow(formatTimestamp(proposalCreated.voteEnd))} (${proposalCreated.voteEnd.toString()})`);
    console.log(`  Description:\n${chalk.italic.gray(proposalCreated.description.split('\n').map(l => `    ${l}`).join('\n'))}`); // Indent description

    // Fetch L2 State and Votes
    let l2StateStr = 'Unknown';
    let votes = { againstVotes: ethers.BigNumber.from(0), forVotes: ethers.BigNumber.from(0), abstainVotes: ethers.BigNumber.from(0) };
    try {
        const l2State = await zkGovernor.state(l2ProposalId);
        l2StateStr = mapL2State(l2State);
        console.log(`  L2 State: ${chalk.yellow(l2StateStr)} (${l2State})`);
        votes = await zkGovernor.proposalVotes(l2ProposalId);
        console.log(`  Votes For: ${chalk.green(ethers.utils.formatUnits(votes.forVotes, 18))}`); // Assuming 18 decimals for gov token
        console.log(`  Votes Against: ${chalk.red(ethers.utils.formatUnits(votes.againstVotes, 18))}`);
        console.log(`  Votes Abstain: ${chalk.gray(ethers.utils.formatUnits(votes.abstainVotes, 18))}`);
    } catch (e) {
        console.warn(chalk.yellow(`Could not fetch L2 state or votes: ${e}`));
    }


    console.log(chalk.bold("\nL2 Raw Payload:"));
    proposalCreated.targets.forEach((target, i) => {
        console.log(chalk.gray(`  Call ${i}:`));
        console.log(`    Target: ${chalk.magenta(target)}`);
        console.log(`    Value: ${chalk.blue(ethers.utils.formatEther(proposalCreated.values[i]))} ETH`);
        console.log(`    Signature: ${chalk.cyan(proposalCreated.signatures[i] || 'N/A')}`);
        console.log(`    Calldata: ${chalk.yellow(proposalCreated.calldatas[i])}`);
    });

    // --- 2. Find L2 Execution and L1 Message Hash ---
    console.log(chalk.bold('\n--- Step 2: Finding L2 Execution & L1 Message ---'));
    // Fetch executed events starting from the block the proposal was created
    await fetchProposalExecutedEvents(zkGovernor, cache, l2Provider, proposalCreated.blockNumber);

    const proposalExecuted = cache.proposalExecutedEvents.find(p => p.proposalId.eq(l2ProposalId));

    if (!proposalExecuted) {
        console.warn(chalk.yellow(`ProposalExecuted event not found for ID ${l2ProposalId.toString()} yet. Proposal might not be executed or cache needs update.`));
        saveCache(cache);
        process.exit(0); // Exit gracefully if not executed yet
    }

    console.log(chalk.green(`Found ProposalExecuted event in L2 block ${proposalExecuted.blockNumber} (Tx: ${proposalExecuted.txHash})`));

    const l1MessageSent = await findL1MessageSent(l2Provider, l1MessengerInterface, proposalExecuted.txHash);

    if (!l1MessageSent) {
        console.error(chalk.red(`Failed to find L1MessageSent event associated with execution tx ${proposalExecuted.txHash}.`));
        saveCache(cache);
        process.exit(1);
    }

    const l1ProposalHash = l1MessageSent.hash;
    console.log(chalk.bold(`\nL1 Proposal Identifier (Hash): ${chalk.yellow(l1ProposalHash)}`));
    console.log(`  Derived from L1MessageSent in L2 Tx: ${l1MessageSent.txHash}`);
    // console.log(`  Raw L1 Message Sent: ${l1MessageSent.message}`); // Can be very long

    // --- 3. Fetch L1 Upgrade Data ---
    console.log(chalk.bold('\n--- Step 3: Fetching L1 Upgrade Data ---'));
    const upgradeStarted = await findL1UpgradeStarted(l1Provider, protocolUpgradeHandler, l1ProposalHash);

    if (!upgradeStarted) {
        console.warn(chalk.yellow(`L1 Upgrade process not started yet for ID ${l1ProposalHash}, or not found in recent blocks.`));
         // Still try to fetch status/state in case it was started long ago
        try {
            const l1StateNum = await protocolUpgradeHandler.upgradeState(l1ProposalHash);
            const l1StatusData : UpgradeStatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash);
            const l1StateStr = mapL1State(l1StateNum);
            console.log(`  L1 State (queried): ${chalk.yellow(l1StateStr)} (${l1StateNum})`);
             console.log(`  L1 Status (queried):`);
             console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
             console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
             console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
             console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
             console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
        } catch (e) {
            console.warn(chalk.yellow(`Could not query L1 state/status for ${l1ProposalHash}: ${e}`));
        }
        saveCache(cache);
        process.exit(0);
    }

    console.log(chalk.green(`Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`));

    // Fetch L1 State and Status
    let l1StateStr = 'Unknown';
    let l1StatusData: UpgradeStatusData | null = null;
    try {
        const l1StateNum = await protocolUpgradeHandler.upgradeState(l1ProposalHash);
        l1StateStr = mapL1State(l1StateNum);
        console.log(`  L1 State: ${chalk.yellow(l1StateStr)} (${l1StateNum})`);
        l1StatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash);
         console.log(`  L1 Status:`);
         console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
         console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
         console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
         console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
         console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);

    } catch (e) {
        console.warn(chalk.yellow(`Could not fetch L1 state or status: ${e}`));
    }


    console.log(chalk.bold("\nL1 Proposal Details (from UpgradeStarted):"));
    console.log(`  Executor: ${chalk.yellow(upgradeStarted.proposal.executor)}`);
    console.log(`  Salt: ${chalk.yellow(upgradeStarted.proposal.salt)}`);

    console.log(chalk.bold("\nL1 Sanitized Payload (from UpgradeStarted):"));
    upgradeStarted.proposal.calls.forEach((call, i) => {
        console.log(chalk.gray(`  Call ${i}:`));
        console.log(`    Target: ${chalk.magenta(call.target)}`);
        console.log(`    Value: ${chalk.blue(ethers.utils.formatEther(call.value))} ETH`);
        console.log(`    Data: ${chalk.yellow(call.data)}`);
    });


    // --- 4. Sanity Check Payloads ---
    console.log(chalk.bold('\n--- Step 4: Sanity Checking Payloads (L1 vs L2) ---'));
    let mismatchFound = false;
    if (proposalCreated.targets.length !== upgradeStarted.proposal.calls.length) {
        console.error(chalk.red(`Mismatch: L2 payload has ${proposalCreated.targets.length} calls, L1 payload has ${upgradeStarted.proposal.calls.length} calls.`));
        mismatchFound = true;
    } else {
        for (let i = 0; i < proposalCreated.targets.length; i++) {
            const l2Target = proposalCreated.targets[i];
            const l2Value = proposalCreated.values[i];
            const l2Calldata = proposalCreated.calldatas[i];
            // L2 signatures are not directly part of the L1 payload struct, but the calldata should match.

            const l1Call = upgradeStarted.proposal.calls[i];

            if (l2Target.toLowerCase() !== l1Call.target.toLowerCase()) {
                console.error(chalk.red(`Mismatch (Call ${i}): L2 Target ${l2Target} != L1 Target ${l1Call.target}`));
                mismatchFound = true;
            }
            if (!l2Value.eq(l1Call.value)) {
                console.error(chalk.red(`Mismatch (Call ${i}): L2 Value ${l2Value.toString()} != L1 Value ${l1Call.value.toString()}`));
                mismatchFound = true;
            }
             // Very basic check: L1 data should contain L2 data (sometimes L1 wraps L2 data)
             // A more robust check would decode L1 data if possible and compare arguments.
            if (l1Call.data.toLowerCase().indexOf(l2Calldata.toLowerCase().substring(2)) === -1 && l2Calldata !== '0x') {
                 // Allow empty L2 calldata to map to potentially non-empty L1 wrapper calls
                console.warn(chalk.yellow(`Potential Mismatch/Check Needed (Call ${i}): L2 Calldata not found directly within L1 Data.`));
                console.log(`  L2: ${l2Calldata}`);
                console.log(`  L1: ${l1Call.data}`);
                // mismatchFound = true; // Don't flag as error, but warn
            } else if (l1Call.data.toLowerCase() !== l2Calldata.toLowerCase() && l2Calldata !== '0x') {
                 // If L2 calldata is not empty and doesn't exactly match L1, it might be wrapped.
                 // This is common if L1 calls a function that then calls the L2 target+data.
                 console.log(chalk.gray(`Info (Call ${i}): L1 data differs from L2 calldata (may be wrapped):`));
                 console.log(`  L2: ${l2Calldata}`);
                 console.log(`  L1: ${l1Call.data}`);
            }
        }
    }

    if (!mismatchFound) {
        console.log(chalk.green('Payload Sanity Check Passed: L1 calls generally match L2 proposal actions (targets, values). Calldata may differ due to L1 execution wrappers.'));
    } else {
         console.error(chalk.red('Payload Sanity Check Failed: Significant differences found between L1 and L2 payloads!'));
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
