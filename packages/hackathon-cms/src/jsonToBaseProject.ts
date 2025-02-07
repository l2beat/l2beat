import Handlebars from "handlebars";

import type { BaseProject } from './BaseProject';
import type { ProjectJSON } from './types';

import arbProjectData from './arbitrum_discovered.json';

export function jsonToBaseProject(projectJSON: ProjectJSON): BaseProject {
  // Initialize an empty BaseProject object
  const baseProject: BaseProject = {
    id: '',
    addedAt: Date.now(), // or explicitly set to 0 if needed
    name: '',
    slug: '',
    shortName: undefined
  };

  // Populate BaseProject dynamically based on the sections
  for (const section of projectJSON.sections) {
    switch (section.type) {
      case 'BASIC_INFO':
        baseProject.name = section.name || '';
        baseProject.slug = section.slug || '';
        break;

      case 'BADGES':
        baseProject.badges = section.badges || [];
        break;

      case 'DISCOVERY':
        baseProject.contracts = arbProjectData.contracts;
        break;

      case 'LINKS':
        // If a LINKS section exists, update display.links accordingly.
        baseProject.display = {
          links: section.links,
          description: ""
        }
        break;

      case 'MILESTONES':
        // If a MILESTONES section exists, update milestones accordingly.
        baseProject.milestones = section.milestones;
        break;

      case 'TECHNOLOGY':
        const contracts: Record<string, unknown> = {}
        for (const ctr of arbProjectData.contracts) {
          contracts[ctr.name] = ctr.values
        }
        const template = Handlebars.compile(section.technology)

        baseProject.technology = template(contracts);
        break;
    }
  }

  return baseProject;
}

export function jsonToBaseProject_2(_: ProjectJSON): BaseProject {

  const contracts: Record<string, unknown> = {}
  for (const ctr of arbProjectData.contracts) {
    contracts[ctr.name] = ctr.values
  }
  const template = Handlebars.compile("Arbitrum technology is complex. Look, here's one contract - {{ Outbox.$admin }}")


  return {
    id: 'arbitrum',
    addedAt: 0,
    name: 'Arbitrum',
    slug: 'arbitrum',
    shortName: '',
    badges: ["EVM", "WasmVM"],
    technology: template(contracts),
    milestones: [
      {
        title: "Exit window extension to 7 days",
        url: "https://www.tally.xyz/gov/arbitrum/proposal/27888300053486667232765715922683646778055572080881341292116987136155397805421?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
        date: "2024 Oct 25th",
        type: 'general'
      },
      {
        title: "ArbOS 32 Emergency upgrade",
        url: "https://github.com/OffchainLabs/nitro/releases/tag/v3.2.0",
        date: "2024 Sep 25th",
        type: 'incident',
        description: "SecurityCouncil emergency upgrades to fix attack vectors related to Stylus resource pricing."
      },
      {
        title: "ArbOS 31 Bianca upgrade",
        url: "https://www.tally.xyz/gov/arbitrum/proposal/108288822474129076868455956066667369439381709547570289793612729242368710728616",
        date: "2024 Sep 3rd",
        type: 'general',
        description: "Arbitrum upgrades to ArbOS 31 activating Stylus (new languages for smart contracts)."
      }
    ],
    contracts: arbProjectData.contracts,
    display: {
      description:
        "Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.",
      links: {
        websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
        apps: ['https://bridge.arbitrum.io'],
        documentation: [
          'https://docs.arbitrum.io',
          'https://docs.arbitrum.foundation/',
        ],
        explorers: [
          'https://arbiscan.io',
          'https://explorer.arbitrum.io/',
          'https://arbitrum.l2scan.co/',
        ],
        repositories: [
          'https://github.com/ArbitrumFoundation/docs',
          'https://github.com/ArbitrumFoundation/governance',
          'https://github.com/OffchainLabs/arbitrum',
          'https://github.com/OffchainLabs/nitro',
          'https://github.com/OffchainLabs/arb-os',
        ],
        socialMedia: [
          'https://twitter.com/arbitrum',
          'https://arbitrumfoundation.medium.com/',
          'https://discord.gg/Arbitrum',
          'https://youtube.com/@Arbitrum',
          'https://t.me/arbitrum',
        ],
        rollupCodes: ['https://rollup.codes/arbitrum-one'],
      },
    },
  };
}
