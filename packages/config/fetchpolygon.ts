import { ethers } from 'ethers';
import fs from 'fs';
import { table } from 'table';

// Configuration (easy to maintain)
const CONFIG = {
  // RPC endpoint - replace with your preferred provider
  rpcUrl: 'https://ethereum.publicnode.com',

  // Contract details
  rollupManagerAddress: '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',

  // Output file path
  outputFilePath: './polycdk_rollup_data.json',

  // Known rollup names (prefilled with provided data)
  rollupNames: {
    '1': 'polygon zkEVM',
    '2': 'astar',
    '3': 'OkX X Layer',
    '4': 'OEV network',
    '5': 'gptprotocol.org',
    '6': 'witnesschain',
    '7': 'lumia.org',
    '8': 'pay network (wirex)',
    '9': 'silicon-zk',
    '10': 'silicon-zk',
    '11': 'haust.network',
    '12': 'haust.network',
    '13': 'ternoa.network',
    '14': 'unknown cdk sov chain (z-chain, z token)',
    '15': 'pentagon.games/pen-chain'
  }
};

// Interface for the RollupManager contract
const rollupManagerAbi = [
  'function rollupIDToRollupDataV2(uint32 rollupID) view returns (tuple(address rollupContract, uint64 chainID, address verifier, uint64 forkID, bytes32 lastLocalExitRoot, uint64 lastBatchSequenced, uint64 lastVerifiedBatch, uint64 lastVerifiedBatchBeforeUpgrade, uint64 rollupTypeID, uint8 rollupVerifierType, bytes32 lastPessimisticRoot, bytes32 programVKey) rollupData)'
];

// Type definition for rollup data
interface RollupData {
  rollupContract: string;
  chainID: bigint;
  verifier: string;
  forkID: bigint;
  lastLocalExitRoot: string;
  lastBatchSequenced: bigint;
  lastVerifiedBatch: bigint;
  lastVerifiedBatchBeforeUpgrade: bigint;
  rollupTypeID: bigint;
  rollupVerifierType: number;
  lastPessimisticRoot: string;
  programVKey: string;
}

// Extended type with rollupID and name
interface RollupDataExtended extends RollupData {
  rollupID: number;
  name: string;
}

async function main() {
  // Connect to Ethereum network
  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);

  // Create contract instance
  const rollupManager = new ethers.Contract(
    CONFIG.rollupManagerAddress,
    rollupManagerAbi,
    provider
  );

  // Fetch rollup data
  const rollupDataList: RollupDataExtended[] = [];
  let rollupID = 1;
  let continueLoop = true;

  console.log('Fetching rollup data...');

  while (continueLoop) {
    try {
      const data: RollupData = await rollupManager.rollupIDToRollupDataV2(rollupID);

      // Add to our list with extended information
      rollupDataList.push({
        ...data,
        rollupID,
        name: CONFIG.rollupNames[rollupID.toString()] || 'Unknown'
      });

      console.log(`Fetched data for rollupID: ${rollupID}`);
      rollupID++;
    } catch (error) {
      console.log(`No more rollups found after ID ${rollupID - 1}`);
      continueLoop = false;
    }
  }

  // Save complete data to file
  fs.writeFileSync(
    CONFIG.outputFilePath,
    JSON.stringify(rollupDataList, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value, 
    2)
  );
  console.log(`Full data saved to ${CONFIG.outputFilePath}`);

  // Display table with selected fields
  const tableData = [
    ['RollupID', 'Name', 'ChainID', 'ForkID', 'RollupTypeID', 'VerifierType']
  ];

  rollupDataList.forEach(data => {
    tableData.push([
      data.rollupID.toString(),
      data.name,
      data.chainID.toString(),
      data.forkID.toString(),
      data.rollupTypeID.toString(),
      data.rollupVerifierType.toString()
    ]);
  });

  console.log('Rollup Data Summary:');
  console.log(table(tableData));
}

main().catch(error => {
  console.error('Error executing script:', error);
  process.exit(1);
});
