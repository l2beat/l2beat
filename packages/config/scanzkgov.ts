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
            // Ensure arrays exist
            cache.proposalCreatedEvents = cache.proposalCreatedEvents || [];
            cache.proposalExecutedEvents = cache.proposalExecutedEvents || [];
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
    if (!timestamp || ethers.BigNumber.from(timestamp).isZero()) return "N/A"; // Check if null, undefined or zero
    try {
        const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000);
        return date.toLocaleString();
    } catch (e) {
        console.warn(chalk.yellow(`Could not format timestamp ${timestamp}: ${e}`));
        return "Invalid Date";
    }
}

/**
 * Maps L2 Governor state enum to string.
 */
function mapL2State(state: number): string {
    const states = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
    return states[state] ?? "Unknown"; // Use nullish coalescing
}

/**
 * Maps L1 Handler state enum to string.
 */
function mapL1State(state: number): string {
    const states = ["None", "LegalVetoPeriod", "Waiting", "ExecutionPending", "Ready", "Expired", "Done"];
    return states[state] ?? "Unknown"; // Use nullish coalescing
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
    // Fetch new events since the last cached block
    let fromBlock = cache.lastBlockFetched + 1;

    if (fromBlock > latestBlock) {
        console.log(chalk.gray("Cache is up to date for ProposalCreated events."));
        return;
    }

    console.log(chalk.blue(`Fetching ProposalCreated events from block ${fromBlock} to ${latestBlock}...`));

    try {
        const eventFilter = governorContract.filters.ProposalCreated();
        const chunkSize = 1000000000;
        let currentBlock = fromBlock;
        const allLogs: ethers.Event[] = [];
        const existingTxHashes = new Set(cache.proposalCreatedEvents.map(e => e.txHash));

        while (currentBlock <= latestBlock) {
            const toBlock = Math.min(currentBlock + chunkSize - 1, latestBlock);
            console.log(chalk.gray(`  Querying ProposalCreated chunk: ${currentBlock} to ${toBlock}`));
            try {
                const logsChunk = await governorContract.queryFilter(eventFilter, currentBlock, toBlock);
                allLogs.push(...logsChunk);
            } catch (chunkError) {
                 console.error(chalk.red(`  Error fetching ProposalCreated logs chunk (${currentBlock}-${toBlock}): ${chunkError}. Skipping chunk.`));
            }
            currentBlock = toBlock + 1;
        }

        console.log(chalk.gray(`Found ${allLogs.length} new ProposalCreated events in total.`));
        let countAdded = 0;
        for (const log of allLogs) {
             if (existingTxHashes.has(log.transactionHash)) continue;
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
                existingTxHashes.add(log.transactionHash);
                countAdded++;
            } catch (e) {
                console.warn(chalk.yellow(`Could not parse ProposalCreated log in tx ${log.transactionHash}: ${e}`));
            }
        }
         console.log(chalk.gray(`Added ${countAdded} new unique ProposalCreated events to cache.`));

    } catch (error) {
         console.error(chalk.red(`Error fetching ProposalCreated events: ${error}`));
    }
    // Update cache marker regardless of errors during parsing/adding
    cache.lastBlockFetched = latestBlock;
}


/**
 * Fetches ProposalExecuted events from ZKsync Era, ensuring the range covers the specific proposal.
 * Adds unique events found to the cache.
 */
async function fetchProposalExecutedEvents(
    governorContract: ethers.Contract,
    cache: EventCache,
    l2Provider: ethers.providers.JsonRpcProvider,
    startBlock: number // Start searching from the block the proposal was created
): Promise<void> {
    // --- MODIFICATION START: Force query range for specific proposal ---
    const queryFromBlock = Math.max(0, startBlock); // Ensure startBlock is not negative
    const queryToBlock = await l2Provider.getBlockNumber(); // Get current latest block

    if (queryFromBlock > queryToBlock) {
        console.log(chalk.yellow(`Proposal creation block ${queryFromBlock} is ahead of latest block ${queryToBlock}. No range to query for execution.`));
        return; // Nothing to query
    }

    console.log(chalk.blue(`Fetching ProposalExecuted events relevant to this proposal from block ${queryFromBlock} up to ${queryToBlock}...`));
    // DEBUG: Log the effective search range
    console.log(chalk.dim(`  [DEBUG Executed] Effective Search Range: ${queryFromBlock} - ${queryToBlock}`));
    // --- MODIFICATION END ---

    try {
        const eventFilter = governorContract.filters.ProposalExecuted();
        // Fetch in chunks
        const chunkSize = 1000000000;
        let currentBlock = queryFromBlock; // Use the calculated queryFromBlock
        const allLogs: ethers.Event[] = [];
        // Use cache to check for duplicates *before* adding
        const existingTxHashes = new Set(cache.proposalExecutedEvents.map(e => e.txHash));

        while (currentBlock <= queryToBlock) { // Use queryToBlock
            const toBlock = Math.min(currentBlock + chunkSize - 1, queryToBlock);
             console.log(chalk.gray(`  Querying ProposalExecuted chunk: ${currentBlock} to ${toBlock}`));
             try {
                 const logsChunk = await governorContract.queryFilter(eventFilter, currentBlock, toBlock);
                 allLogs.push(...logsChunk);
             } catch (chunkError) {
                 console.error(chalk.red(`  Error fetching ProposalExecuted logs chunk (${currentBlock}-${toBlock}): ${chunkError}. Skipping chunk.`));
             }
            currentBlock = toBlock + 1;
        }

        console.log(chalk.gray(`Found ${allLogs.length} ProposalExecuted events in the checked range (${queryFromBlock} - ${queryToBlock}).`));
        let countAdded = 0;
        for (const log of allLogs) {
            // Avoid adding duplicates already present in the cache
            if (existingTxHashes.has(log.transactionHash)) {
                 continue;
            }
            try {
                const parsedLog = governorContract.interface.parseLog(log);
                const parsedProposalId = parsedLog.args.proposalId;
                // --- DEBUG: Log every parsed ProposalExecuted event ---
                console.log(chalk.dim(`  [DEBUG Executed] Parsed Event -> ID: ${parsedProposalId.toString()}, Block: ${log.blockNumber}, Tx: ${log.transactionHash}`));
                // --- End DEBUG ---

                // Add to cache and update the set for this run
                cache.proposalExecutedEvents.push({
                    proposalId: parsedProposalId,
                    blockNumber: log.blockNumber,
                    txHash: log.transactionHash
                });
                existingTxHashes.add(log.transactionHash); // Add to set to prevent duplicates *within this run*
                countAdded++;
            } catch (e) {
                console.warn(chalk.yellow(`Could not parse ProposalExecuted log in tx ${log.transactionHash}: ${e}`));
            }
        }
         console.log(chalk.gray(`Added ${countAdded} new unique ProposalExecuted events to cache.`));

    } catch (error) {
        console.error(chalk.red(`Error fetching ProposalExecuted events: ${error}`));
    }

    // Update the main cache marker to the latest block scanned overall
    // This helps subsequent runs for *other* proposals or general cache updates.
    if (queryToBlock > cache.lastBlockFetched) {
        cache.lastBlockFetched = queryToBlock;
    } else {
         console.log(chalk.gray(`Cache marker ${cache.lastBlockFetched} remains unchanged as it's >= latest block ${queryToBlock}.`));
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
    try {
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
                     // DEBUG: Log L1MessageSent details
                     console.log(chalk.dim(`  [DEBUG L1Sent] Hash: ${parsedLog.args._hash}, Sender: ${parsedLog.args._sender}`));
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
    } catch (error) {
        console.error(chalk.red(`Error fetching transaction receipt for ${executionTxHash}: ${error}`));
        return null;
    }
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

    try {
        // Filter by indexed event topic `_id`
        const eventFilter = upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash);

        const L1_SEARCH_BLOCK_RANGE = 1000000; // Look back ~2 weeks, adjust if needed
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
             // DEBUG: Log UpgradeStarted details
             console.log(chalk.dim(`  [DEBUG L1Started] ID: ${parsedLog.args._id}, Block: ${log.blockNumber}, Tx: ${log.transactionHash}`));
            const proposalData = parsedLog.args._proposal;
            return {
                id: parsedLog.args._id,
                proposal: {
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
    } catch (error) {
        console.error(chalk.red(`Error searching for L1 UpgradeStarted event: ${error}`));
        return null;
    }
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

    try {
        await l2Provider.getNetwork();
        console.log(chalk.green(`Connected to ZKsync Era RPC: ${l2Provider.connection.url}`));
    } catch (e) {
        console.error(chalk.red(`Failed to connect to ZKsync Era RPC: ${e}`));
        process.exit(1);
    }
    try {
        await l1Provider.getNetwork();
        console.log(chalk.green(`Connected to Ethereum L1 RPC: ${l1Provider.connection.url}`));
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
    cache.proposalCreatedEvents.sort((a, b) => a.blockNumber - b.blockNumber);
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
    let l2StateStr = 'Unknown';
    let votes = { againstVotes: ethers.BigNumber.from(0), forVotes: ethers.BigNumber.from(0), abstainVotes: ethers.BigNumber.from(0) };
    try {
        const l2State = await zkGovernor.state(l2ProposalId);
        l2StateStr = mapL2State(l2State);
        console.log(`  L2 State: ${chalk.yellow(l2StateStr)} (${l2State})`);
        votes = await zkGovernor.proposalVotes(l2ProposalId);
        try {
            console.log(`  Votes For: ${chalk.green(ethers.utils.formatUnits(votes.forVotes, 18))}`);
            console.log(`  Votes Against: ${chalk.red(ethers.utils.formatUnits(votes.againstVotes, 18))}`);
            console.log(`  Votes Abstain: ${chalk.gray(ethers.utils.formatUnits(votes.abstainVotes, 18))}`);
        } catch (formatError) {
             console.warn(chalk.yellow(`Could not format votes: ${formatError}`));
             console.log(`  Votes For (raw): ${chalk.green(votes.forVotes.toString())}`);
             console.log(`  Votes Against (raw): ${chalk.red(votes.againstVotes.toString())}`);
             console.log(`  Votes Abstain (raw): ${chalk.gray(votes.abstainVotes.toString())}`);
        }
    } catch (e) {
        console.warn(chalk.yellow(`Could not fetch L2 state or votes: ${e}`));
    }


    console.log(chalk.bold("\nL2 Raw Payload:"));
    if (proposalCreated.targets && Array.isArray(proposalCreated.targets)) {
        proposalCreated.targets.forEach((target, i) => {
            console.log(chalk.gray(`  Call ${i}:`));
            console.log(`    Target: ${chalk.magenta(target)}`);
            const l2Value = proposalCreated.values?.[i];
            let formattedValue = 'N/A';
            if (l2Value !== undefined && l2Value !== null) {
                 try {
                     if (ethers.BigNumber.from(l2Value).isZero()) {
                         formattedValue = '0';
                     } else {
                        formattedValue = ethers.utils.formatEther(l2Value);
                     }
                 } catch (e) {
                     console.warn(chalk.yellow(`    Could not format L2 value at index ${i} (${l2Value?.toString()}): ${e}`));
                     formattedValue = `Invalid (${l2Value?.toString() ?? 'undefined'})`;
                 }
            } else {
                formattedValue = '0';
            }
            console.log(`    Value: ${chalk.blue(formattedValue)} ETH`);
            console.log(`    Signature: ${chalk.cyan(proposalCreated.signatures?.[i] || 'N/A')}`);
            console.log(`    Calldata: ${chalk.yellow(proposalCreated.calldatas?.[i] || '0x')}`);
        });
    } else {
        console.log(chalk.gray("  No targets found in L2 payload."));
    }


    // --- 2. Find L2 Execution and L1 Message Hash ---
    console.log(chalk.bold('\n--- Step 2: Finding L2 Execution & L1 Message ---'));
    // Fetch/update executed events, ensuring range from creation block is covered
    await fetchProposalExecutedEvents(zkGovernor, cache, l2Provider, proposalCreated.blockNumber);
    // Sort the potentially updated cache before searching
    cache.proposalExecutedEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    // --- DEBUG: Log cache size and target ID before searching ---
    console.log(chalk.dim(`  [DEBUG Executed] Searching for Proposal ID: ${l2ProposalId.toString()}`));
    console.log(chalk.dim(`  [DEBUG Executed] Cache now contains ${cache.proposalExecutedEvents.length} ProposalExecuted events.`));
    // --- End DEBUG ---

    const proposalExecuted = cache.proposalExecutedEvents.find(p => p.proposalId.eq(l2ProposalId));

    if (!proposalExecuted) {
        console.warn(chalk.yellow(`ProposalExecuted event not found for ID ${l2ProposalId.toString()} after re-checking full range. Please double-check the proposal ID and its status on a block explorer.`));
        // --- DEBUG: Add extra context on failure ---
        console.log(chalk.dim(`  [DEBUG Executed] Failed to find ID ${l2ProposalId.toString()} in the cache after fetching from block ${proposalCreated.blockNumber}.`));
        console.log(chalk.dim(`  [DEBUG Executed] Last block fetched according to cache: ${cache.lastBlockFetched}`));
        // --- End DEBUG ---
        saveCache(cache);
        process.exit(0);
    }

    // --- If found ---
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

    // --- 3. Fetch L1 Upgrade Data ---
    console.log(chalk.bold('\n--- Step 3: Fetching L1 Upgrade Data ---'));
    const upgradeStarted = await findL1UpgradeStarted(l1Provider, protocolUpgradeHandler, l1ProposalHash);

    // Always Try to Fetch L1 State/Status
    let l1StateStr = 'Unknown';
    let l1StatusData: UpgradeStatusData | null = null;
    let l1StateNum : number | null = null;
    try {
        l1StateNum = await protocolUpgradeHandler.upgradeState(l1ProposalHash);
        l1StateStr = mapL1State(l1StateNum);
        l1StatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash);
    } catch (e) {
         console.warn(chalk.yellow(`Could not query L1 state/status for ${l1ProposalHash}: ${e}`));
    }

    if (!upgradeStarted) {
        console.warn(chalk.yellow(`L1 UpgradeStarted event not found for ID ${l1ProposalHash}, or not found in recent blocks.`));
         if (l1StateNum !== null) console.log(`  L1 State (queried): ${chalk.yellow(l1StateStr)} (${l1StateNum})`);
         if (l1StatusData) {
             console.log(`  L1 Status (queried):`);
             console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
             console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
             console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
             console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
             console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
         }
        saveCache(cache);
        process.exit(0);
    }

    // If UpgradeStarted event was found
    console.log(chalk.green(`Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`));
    if (l1StateNum !== null) console.log(`  L1 State: ${chalk.yellow(l1StateStr)} (${l1StateNum})`);
    if (l1StatusData) {
         console.log(`  L1 Status:`);
         console.log(`    Created: ${chalk.yellow(formatTimestamp(l1StatusData.creationTimestamp))}`);
         console.log(`    SC Approved: ${chalk.yellow(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`);
         console.log(`    Guardians Approved: ${chalk.yellow(l1StatusData.guardiansApproval)}`);
         console.log(`    Guardians Extended Veto: ${chalk.yellow(l1StatusData.guardiansExtendedLegalVeto)}`);
         console.log(`    Executed: ${chalk.yellow(l1StatusData.executed)}`);
    }


    console.log(chalk.bold("\nL1 Proposal Details (from UpgradeStarted):"));
    console.log(`  Executor: ${chalk.yellow(upgradeStarted.proposal.executor)}`);
    console.log(`  Salt: ${chalk.yellow(upgradeStarted.proposal.salt)}`);

    console.log(chalk.bold("\nL1 Sanitized Payload (from UpgradeStarted):"));
    if (upgradeStarted.proposal.calls && Array.isArray(upgradeStarted.proposal.calls)) {
        upgradeStarted.proposal.calls.forEach((call, i) => {
            console.log(chalk.gray(`  Call ${i}:`));
            console.log(`    Target: ${chalk.magenta(call.target)}`);
             let formattedL1Value = 'N/A';
             try {
                 if (ethers.BigNumber.from(call.value).isZero()) {
                     formattedL1Value = '0';
                 } else {
                     formattedL1Value = ethers.utils.formatEther(call.value);
                 }
             } catch (e) {
                 console.warn(chalk.yellow(`    Could not format L1 value at index ${i} (${call.value?.toString()}): ${e}`));
                 formattedL1Value = `Invalid (${call.value?.toString() ?? 'undefined'})`;
             }
            console.log(`    Value: ${chalk.blue(formattedL1Value)} ETH`);
            console.log(`    Data: ${chalk.yellow(call.data)}`);
        });
    } else {
         console.log(chalk.gray("  No calls found in L1 payload."));
    }


    // --- 4. Sanity Check Payloads ---
    console.log(chalk.bold('\n--- Step 4: Sanity Checking Payloads (L1 vs L2) ---'));
    let mismatchFound = false;
    const l2Targets = proposalCreated.targets ?? [];
    const l1Calls = upgradeStarted.proposal.calls ?? [];

    if (l2Targets.length !== l1Calls.length) {
        console.error(chalk.red(`Mismatch: L2 payload has ${l2Targets.length} calls, L1 payload has ${l1Calls.length} calls.`));
        mismatchFound = true;
    } else {
        for (let i = 0; i < l2Targets.length; i++) {
            const l2Target = l2Targets[i];
            const l2Value = proposalCreated.values?.[i] ?? ethers.BigNumber.from(0);
            const l2Calldata = proposalCreated.calldatas?.[i] ?? '0x';
            const l1Call = l1Calls[i];

            if (l2Target.toLowerCase() !== l1Call.target.toLowerCase()) {
                console.error(chalk.red(`Mismatch (Call ${i}): L2 Target ${l2Target} != L1 Target ${l1Call.target}`));
                mismatchFound = true;
            }
            if (!ethers.BigNumber.from(l2Value).eq(l1Call.value)) {
                console.error(chalk.red(`Mismatch (Call ${i}): L2 Value ${l2Value.toString()} != L1 Value ${l1Call.value.toString()}`));
                mismatchFound = true;
            }
            const l2DataToCheck = l2Calldata.toLowerCase().substring(2);
            if (l2DataToCheck && l1Call.data.toLowerCase().indexOf(l2DataToCheck) === -1) {
                console.warn(chalk.yellow(`Potential Mismatch/Check Needed (Call ${i}): L2 Calldata not found within L1 Data.`));
                console.log(`  L2: ${l2Calldata}`);
                console.log(`  L1: ${l1Call.data}`);
            } else if (l2DataToCheck && l1Call.data.toLowerCase() !== l2Calldata.toLowerCase()) {
                 console.log(chalk.gray(`Info (Call ${i}): L1 data differs from L2 calldata (may be wrapped):`));
                 console.log(`  L2: ${l2Calldata}`);
                 console.log(`  L1: ${l1Call.data}`);
            }
        }
    }

    if (!mismatchFound) {
        console.log(chalk.green('Payload Sanity Check Passed: L1 calls generally match L2 proposal actions (targets, values). Calldata differences may indicate L1 execution wrappers.'));
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
    try {
        // Attempt to save cache even on unexpected errors
        // const finalCache = loadCache(); // Or pass cache object if possible
        // saveCache(finalCache);
    } catch (saveError) {
        console.error(chalk.red(`Failed to save cache during error handling: ${saveError}`));
    }
    process.exit(1);
});
