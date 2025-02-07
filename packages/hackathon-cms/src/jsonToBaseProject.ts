import type { BaseProject } from './BaseProject'
import type { ProjectJSON } from './types'
import arbProjectData from './arbitrum_discovered.json'


export function jsonToBaseProject(projectJSON: ProjectJSON): BaseProject {
  // Initialize an empty BaseProject object
  const baseProject: BaseProject = {
    id: '',
    addedAt: Date.now(), // or explicitly set `0` if needed
    name: '',
    slug: '',
    shortName: undefined,
    badges: [],
    contracts: undefined,
    display: {
      description: '',
      links: {
        websites: [],
        apps: [],
        documentation: [],
        explorers: [],
        repositories: [],
        socialMedia: [],
        rollupCodes: '',
      },
    },
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
        if (section.url) {
          baseProject.display?.links.websites?.push(section.url);
        }
        break;
    }
  }

  return baseProject;
}


export function jsonToBaseProject_2(_: ProjectJSON): BaseProject {
  return {
    id: 'arbitrum',
    addedAt: 0,
    name: 'Arbitrum',
    slug: 'arbitrum',
    shortName: undefined,
    badges: ["EVM", "WasmVM"],
    contracts: arbProjectData.contracts,
    display: {
      description: "Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.",
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
        rollupCodes: 'https://rollup.codes/arbitrum-one',
      }
    }
  }
}
