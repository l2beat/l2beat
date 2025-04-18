// implementations/zkgovproposal.ts
import { IProvider } from "@l2beat/discovery";
import { EthereumAddress, Hash256, Bytes } from "@l2beat/shared-pure";
import chalk from "chalk";
import * as fs from "fs";
import { ethers } from "ethers";

// Contract addresses
const ZK_PROTOCOL_GOVERNOR = EthereumAddress("0x76705327e682F2d96943280D99464Ab61219e34f");
const L1_MESSENGER = EthereumAddress("0x0000000000000000000000000000000000008008");
const PROTOCOL_UPGRADE_HANDLER = EthereumAddress("0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3");

// Time constants
const EXECUTION_DELAY = 3 * 60 * 60; // 3 hours in seconds
const STANDARD_LEGAL_VETO_PERIOD = 3 * 24 * 60 * 60; // 3 days
const EXTENDED_LEGAL_VETO_PERIOD = 7 * 24 * 60 * 60; // 7 days
const UPGRADE_DELAY_PERIOD = 1 * 24 * 60 * 60; // 1 day
const UPGRADE_WAIT_OR_EXPIRE_PERIOD = 30 * 24 * 60 * 60; // 30 days

// Enums
enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

enum UpgradeState {
  None,
  LegalVetoPeriod,
  Waiting,
  ExecutionPending,
  Ready,
  Expired,
  Done
}

// Data interfaces
interface ProposalData {
  proposalId: string;
  proposer: string;
  targets: string[];
  values: bigint[];
  signatures: string[];
  calldatas: string[];
  voteStart: number;
  voteEnd: number;
  description: string;
  state: ProposalState;
  executedTx?: string;
  l1MessageHash?: string;
  l1State?: UpgradeState;
  l1UpgradeStatus?: {
    creationTimestamp: number;
    securityCouncilApprovalTimestamp: number;
    guardiansApproval: boolean;
    guardiansExtendedLegalVeto: boolean;
    executed: boolean;
  };
  l1LegalVetoExtended?: boolean;
}

export class ZkGovProposalAnalyzer {
  private readonly executionDelaySeconds: number;

  constructor(
    private readonly l2Provider: IProvider,
    private readonly l1Provider: IProvider,
    executionDelayHours: number = 3
  ) {
    this.executionDelaySeconds = executionDelayHours * 60 * 60;
  }

  async analyzeProposal(proposalId: string, outputMarkdown?: string): Promise<void> {
    console.log(chalk.blue.bold(`Analyzing ZKsync governance proposal: ${proposalId}`));

    try {
      // Fetch proposal data from L2
      const proposalData = await this.fetchProposalData(proposalId);

      // Check if executed and if we need to track it to L1
      if (proposalData.state === ProposalState.Executed && proposalData.executedTx) {
        await this.trackProposalToL1(proposalData);
      }

      // Output the results
      if (outputMarkdown) {
        this.writeMarkdownOutput(proposalData, outputMarkdown);
      } else {
        this.displayTerminalOutput(proposalData);
      }
    } catch (error) {
      console.error(chalk.red.bold("Error analyzing proposal:"), error);
    }
  }

  private async fetchProposalData(proposalId: string): Promise<ProposalData> {
    console.log(chalk.yellow("Fetching proposal data from ZKsync Era..."));

    // Find the ProposalCreated event with this proposalId
    const proposalCreatedTopic = "0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0";

    // We need to search through logs since proposalId is not an indexed parameter
    const logs = await this.l2Provider.getLogs(
      ZK_PROTOCOL_GOVERNOR,
      [proposalCreatedTopic]
    );

    // Find the event with our proposalId by decoding each log
    let proposalEvent: any | undefined;
    let proposalLog: any | undefined;

    const abiCoder = new ethers.utils.AbiCoder();
    const proposalCreatedAbi = [
      "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)"
    ];
    const iface = new ethers.utils.Interface(proposalCreatedAbi);

    for (const log of logs) {
      try {
        const decoded = iface.parseLog({
          topics: log.topics,
          data: log.data
        });

        if (decoded.args.proposalId.toString() === proposalId) {
          proposalEvent = decoded;
          proposalLog = log;
          break;
        }
      } catch (error) {
        // Skip logs that can't be decoded
        continue;
      }
    }

    if (!proposalEvent) {
      throw new Error(`Proposal ${proposalId} not found on chain`);
    }

    // Query the proposal state
    const state = await this.l2Provider.callMethod<number>(
      ZK_PROTOCOL_GOVERNOR,
      "function state(uint256 _proposalId) view returns (uint8)",
      [proposalId]
    );

    if (state === undefined) {
      throw new Error(`Could not get state for proposal ${proposalId}`);
    }

    // Create the proposal data structure
    const proposal: ProposalData = {
      proposalId,
      proposer: proposalEvent.args.proposer,
      targets: proposalEvent.args.targets,
      values: proposalEvent.args.values.map((v: any) => BigInt(v.toString())),
      signatures: proposalEvent.args.signatures,
      calldatas: proposalEvent.args.calldatas,
      voteStart: Number(proposalEvent.args.voteStart),
      voteEnd: Number(proposalEvent.args.voteEnd),
      description: proposalEvent.args.description,
      state: state as ProposalState
    };

    // If the proposal is executed, find the execution transaction
    if (proposal.state === ProposalState.Executed) {
      const executedEventTopic = "0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f";

      // Find the ProposalExecuted event for this proposalId
      const executedLogs = await this.l2Provider.getLogs(
        ZK_PROTOCOL_GOVERNOR,
        [executedEventTopic]
      );

      // Parse each log since proposalId is not indexed
      const executedAbi = ["event ProposalExecuted(uint256 proposalId)"];
      const executedIface = new ethers.utils.Interface(executedAbi);

      for (const log of executedLogs) {
        try {
          const decoded = executedIface.parseLog({
            topics: log.topics,
            data: log.data
          });

          if (decoded.args.proposalId.toString() === proposalId) {
            proposal.executedTx = log.transactionHash;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }

    return proposal;
  }

  private async trackProposalToL1(proposal: ProposalData): Promise<void> {
    if (!proposal.executedTx) {
      console.log(chalk.yellow("No execution transaction found. Cannot track to L1."));
      return;
    }
  
    console.log(chalk.yellow(`Tracking proposal execution from tx: ${proposal.executedTx}`));
  
    // Get the transaction - Convert string to Hash256
    const tx = await this.l2Provider.getTransaction(Hash256(proposal.executedTx));
    if (!tx) {
      console.log(chalk.yellow("Execution transaction not found."));
      return;
    }

    // Find the L1MessageSent event in the transaction
    const l1MessageSentTopic = "0x3c2f0fa422a5d08c3eedf464505927c5b325c48db6346b8d92b5edca6f6ff27c";

    const l1MessageLogs = await this.l2Provider.getLogs(
      L1_MESSENGER,
      [l1MessageSentTopic]
    );

    // Filter logs by transaction hash
    const relevantLogs = l1MessageLogs.filter(
      (log) => log.transactionHash === proposal.executedTx
    );

    if (relevantLogs.length === 0) {
      console.log(chalk.yellow("No L1 message found in execution transaction. Proposal targets only L2."));
      return;
    }

    // Extract the message hash from the event (_hash is index_topic_2)
    if (relevantLogs[0].topics.length < 3) {
      console.log(chalk.yellow("L1 message hash not found in log topics."));
      return;
    }

    const l1MessageHash = relevantLogs[0].topics[2];
    proposal.l1MessageHash = l1MessageHash;

    console.log(chalk.yellow(`Found L1 message hash: ${l1MessageHash}`));
    console.log(chalk.yellow(`Checking L1 ProtocolUpgradeHandler after ${this.executionDelaySeconds / 3600} hours delay...`));

    // Check the upgrade state on L1
    if (l1MessageHash) {
      const upgradeState = await this.l1Provider.callMethod<number>(
        PROTOCOL_UPGRADE_HANDLER,
        "function upgradeState(bytes32 _id) view returns (uint8)",
        [l1MessageHash]
      );

      if (upgradeState !== undefined) {
        proposal.l1State = upgradeState as UpgradeState;

        // Get additional upgrade status details
        const upgradeStatus = await this.l1Provider.callMethod<[number, number, boolean, boolean, boolean]>(
          PROTOCOL_UPGRADE_HANDLER,
          "function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)",
          [l1MessageHash]
        );

        if (upgradeStatus) {
          proposal.l1UpgradeStatus = {
            creationTimestamp: upgradeStatus[0],
            securityCouncilApprovalTimestamp: upgradeStatus[1],
            guardiansApproval: upgradeStatus[2],
            guardiansExtendedLegalVeto: upgradeStatus[3],
            executed: upgradeStatus[4]
          };
        }

        // Check if legal veto was extended
        const vetoExtendedTopic = "0x6679375a2761fa72f4163ccf9a92a514bfd3adff8eb1f2f17256f25834dc46ca";
        const vetoExtendedLogs = await this.l1Provider.getLogs(
          PROTOCOL_UPGRADE_HANDLER,
          [vetoExtendedTopic]
        );

        // Find if any log relates to our proposal (indexed by _id)
        proposal.l1LegalVetoExtended = vetoExtendedLogs.some(
          (log) => log.topics.length > 1 && log.topics[1] === l1MessageHash
        );
      }
    }
  }

  private displayTerminalOutput(proposal: ProposalData): void {
    console.log("\n" + chalk.bold.blue("===== ZKsync Governance Proposal =====") + "\n");

    console.log(chalk.bold("Proposal ID: ") + proposal.proposalId);
    console.log(chalk.bold("Proposer: ") + proposal.proposer);
    console.log(chalk.bold("Description: ") + proposal.description);

    // Vote timing
    const voteStartDate = new Date(proposal.voteStart * 1000);
    const voteEndDate = new Date(proposal.voteEnd * 1000);
    console.log(chalk.bold("Vote Start: ") + voteStartDate.toISOString());
    console.log(chalk.bold("Vote End: ") + voteEndDate.toISOString());

    // L2 State
    console.log("\n" + chalk.bold.yellow("=== L2 Status ==="));

    // Display state with color coding
    let stateColor;
    switch (proposal.state) {
      case ProposalState.Pending:
      case ProposalState.Active:
        stateColor = chalk.yellow;
        break;
      case ProposalState.Canceled:
      case ProposalState.Defeated:
      case ProposalState.Expired:
        stateColor = chalk.red;
        break;
      case ProposalState.Succeeded:
      case ProposalState.Queued:
        stateColor = chalk.blue;
        break;
      case ProposalState.Executed:
        stateColor = chalk.green;
        break;
    }

    console.log(chalk.bold("State: ") + stateColor(ProposalState[proposal.state]));

    if (proposal.executedTx) {
      console.log(chalk.bold("Executed TX: ") + proposal.executedTx);
    }

    // Targets and calldatas
    console.log("\n" + chalk.bold("Targets:"));
    for (let i = 0; i < proposal.targets.length; i++) {
      console.log(`  ${i+1}. ${proposal.targets[i]}`);
      console.log(`     Function: ${proposal.signatures[i]}`);
      console.log(`     Value: ${proposal.values[i]}`);
      console.log(`     Calldata: ${this.formatCalldata(proposal.calldatas[i])}`);
    }

    // L1 Status (if applicable)
    if (proposal.l1MessageHash) {
      console.log("\n" + chalk.bold.magenta("=== L1 Status ==="));
      console.log(chalk.bold("L1 Message Hash: ") + proposal.l1MessageHash);

      if (proposal.l1State !== undefined) {
        let l1StateColor;
        switch (proposal.l1State) {
          case UpgradeState.None:
            l1StateColor = chalk.gray;
            break;
          case UpgradeState.LegalVetoPeriod:
          case UpgradeState.Waiting:
            l1StateColor = chalk.yellow;
            break;
          case UpgradeState.ExecutionPending:
          case UpgradeState.Ready:
            l1StateColor = chalk.blue;
            break;
          case UpgradeState.Expired:
            l1StateColor = chalk.red;
            break;
          case UpgradeState.Done:
            l1StateColor = chalk.green;
            break;
        }

        console.log(chalk.bold("L1 State: ") + l1StateColor(UpgradeState[proposal.l1State]));

        if (proposal.l1UpgradeStatus) {
          const status = proposal.l1UpgradeStatus;

          // Format timestamps
          const creationDate = new Date(status.creationTimestamp * 1000);
          console.log(chalk.bold("Creation Timestamp: ") + creationDate.toISOString());

          if (status.securityCouncilApprovalTimestamp > 0) {
            const approvalDate = new Date(status.securityCouncilApprovalTimestamp * 1000);
            console.log(chalk.bold("Security Council Approval: ") + approvalDate.toISOString());
          }

          console.log(chalk.bold("Guardians Approval: ") + (status.guardiansApproval ? chalk.green("Yes") : chalk.red("No")));
          console.log(chalk.bold("Legal Veto Extended: ") + (proposal.l1LegalVetoExtended ? chalk.yellow("Yes") : "No"));
          console.log(chalk.bold("Executed: ") + (status.executed ? chalk.green("Yes") : chalk.red("No")));

          // Calculate remaining time in each state
          this.displayTimeRemaining(proposal);
        }
      } else {
        console.log(chalk.yellow(`Proposal not yet detected on L1 (still in ${this.executionDelaySeconds/3600}h delay period)`));
      }
    }
  }

  private displayTimeRemaining(proposal: ProposalData): void {
    if (!proposal.l1UpgradeStatus || proposal.l1State === undefined) return;

    const now = Math.floor(Date.now() / 1000);
    const status = proposal.l1UpgradeStatus;

    switch (proposal.l1State) {
      case UpgradeState.LegalVetoPeriod: {
        const vetoPeriod = proposal.l1LegalVetoExtended 
          ? EXTENDED_LEGAL_VETO_PERIOD 
          : STANDARD_LEGAL_VETO_PERIOD;
        const endTime = status.creationTimestamp + vetoPeriod;
        const remaining = Math.max(0, endTime - now);

        console.log(chalk.bold("Legal Veto Period: ") + 
          this.formatTimeRemaining(remaining) + 
          (proposal.l1LegalVetoExtended ? " (extended)" : ""));
        break;
      }
      case UpgradeState.Waiting: {
        const endTime = status.creationTimestamp + 
          (proposal.l1LegalVetoExtended ? EXTENDED_LEGAL_VETO_PERIOD : STANDARD_LEGAL_VETO_PERIOD) + 
          UPGRADE_WAIT_OR_EXPIRE_PERIOD;
        const remaining = Math.max(0, endTime - now);

        console.log(chalk.bold("Waiting Period: ") + this.formatTimeRemaining(remaining));
        break;
      }
      case UpgradeState.ExecutionPending: {
        const endTime = status.securityCouncilApprovalTimestamp + UPGRADE_DELAY_PERIOD;
        const remaining = Math.max(0, endTime - now);

        console.log(chalk.bold("Execution Delay: ") + this.formatTimeRemaining(remaining));
        break;
      }
    }
  }

  private formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) return chalk.green("Complete");

    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m remaining`;
  }

  private formatCalldata(data: string): string {
    if (data.length > 66) {
      return `${data.substring(0, 32)}...${data.substring(data.length - 32)}`;
    }
    return data;
  }

  private writeMarkdownOutput(proposal: ProposalData, outputPath: string): void {
    console.log(chalk.blue(`Writing markdown output to: ${outputPath}`));

    let markdown = `# ZKsync Governance Proposal\n\n`;

    markdown += `- **Proposal ID:** ${proposal.proposalId}\n`;
    markdown += `- **Proposer:** ${proposal.proposer}\n`;
    markdown += `- **Description:** ${proposal.description}\n`;

    // Vote timing
    const voteStartDate = new Date(proposal.voteStart * 1000);
    const voteEndDate = new Date(proposal.voteEnd * 1000);
    markdown += `- **Vote Start:** ${voteStartDate.toISOString()}\n`;
    markdown += `- **Vote End:** ${voteEndDate.toISOString()}\n\n`;

    // L2 State
    markdown += `## L2 Status\n\n`;
    markdown += `- **State:** ${ProposalState[proposal.state]}\n`;

    if (proposal.executedTx) {
      markdown += `- **Executed TX:** ${proposal.executedTx}\n`;
    }

    // Targets and calldatas
    markdown += `\n### Targets\n\n`;
    for (let i = 0; i < proposal.targets.length; i++) {
      markdown += `${i+1}. **${proposal.targets[i]}**\n`;
      markdown += `   - Function: ${proposal.signatures[i]}\n`;
      markdown += `   - Value: ${proposal.values[i]}\n`;
      markdown += `   - Calldata: \`${proposal.calldatas[i]}\`\n\n`;
    }

    // L1 Status (if applicable)
    if (proposal.l1MessageHash) {
      markdown += `## L1 Status\n\n`;
      markdown += `- **L1 Message Hash:** ${proposal.l1MessageHash}\n`;

      if (proposal.l1State !== undefined) {
        markdown += `- **L1 State:** ${UpgradeState[proposal.l1State]}\n`;

        if (proposal.l1UpgradeStatus) {
          const status = proposal.l1UpgradeStatus;

          // Format timestamps
          const creationDate = new Date(status.creationTimestamp * 1000);
          markdown += `- **Creation Timestamp:** ${creationDate.toISOString()}\n`;

          if (status.securityCouncilApprovalTimestamp > 0) {
            const approvalDate = new Date(status.securityCouncilApprovalTimestamp * 1000);
            markdown += `- **Security Council Approval:** ${approvalDate.toISOString()}\n`;
          }

          markdown += `- **Guardians Approval:** ${status.guardiansApproval ? "Yes" : "No"}\n`;
          markdown += `- **Legal Veto Extended:** ${proposal.l1LegalVetoExtended ? "Yes" : "No"}\n`;
          markdown += `- **Executed:** ${status.executed ? "Yes" : "No"}\n\n`;

          // Calculate remaining time in each state
          const now = Math.floor(Date.now() / 1000);

          if (proposal.l1State === UpgradeState.LegalVetoPeriod) {
            const vetoPeriod = proposal.l1LegalVetoExtended 
              ? EXTENDED_LEGAL_VETO_PERIOD 
              : STANDARD_LEGAL_VETO_PERIOD;
            const endTime = status.creationTimestamp + vetoPeriod;
            const remaining = Math.max(0, endTime - now);

            markdown += `- **Legal Veto Period:** ${this.formatTimeRemaining(remaining)} ${proposal.l1LegalVetoExtended ? "(extended)" : ""}\n`;
          } else if (proposal.l1State === UpgradeState.Waiting) {
            const endTime = status.creationTimestamp + 
              (proposal.l1LegalVetoExtended ? EXTENDED_LEGAL_VETO_PERIOD : STANDARD_LEGAL_VETO_PERIOD) + 
              UPGRADE_WAIT_OR_EXPIRE_PERIOD;
            const remaining = Math.max(0, endTime - now);

            markdown += `- **Waiting Period:** ${this.formatTimeRemaining(remaining)}\n`;
          } else if (proposal.l1State === UpgradeState.ExecutionPending) {
            const endTime = status.securityCouncilApprovalTimestamp + UPGRADE_DELAY_PERIOD;
            const remaining = Math.max(0, endTime - now);

            markdown += `- **Execution Delay:** ${this.formatTimeRemaining(remaining)}\n`;
          }
        }
      } else {
        markdown += `- **Status:** Proposal not yet detected on L1 (still in ${this.executionDelaySeconds/3600}h delay period)\n`;
      }
    }

    fs.writeFileSync(outputPath, markdown);
  }
}
