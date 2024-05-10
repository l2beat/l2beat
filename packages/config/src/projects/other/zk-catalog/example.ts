import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

import { ZkCatalogProject } from './types'

export const example: ZkCatalogProject = {
  type: 'zk-catalog',
  display: {
    slug: 'example',
    name: 'Example',
    link: 'https://example.com',
  },
  proofVerification: {
    aggregation: true,
    requiredTools: [
      {
        name: 'Example Tool',
        version: 'v2.3.5',
        link: 'https://example.com',
      },
      {
        name: 'Example Tool 2',
        version: 'v4.1',
        link: 'https://example.com',
      },
      {
        name: 'Example Tool 3',
        version: 'v4.5',
      },
    ],
    verifiers: [
      {
        name: 'Example Verifier',
        description:
          'Ut velit non magna dolor cupidatat consectetur veniam cillum laboris. Ullamco nulla nisi velit in labore sint commodo. Veniam tempor sunt excepteur laborum incididunt cillum minim adipisicing consectetur ipsum. Voluptate sunt nisi ad exercitation anim aliquip do eu ea eu sunt.',
        verified: 'failed',
        contractAddress: EthereumAddress.random(),
        chainId: ChainId.ETHEREUM,
        subVerfiers: [
          {
            name: 'Example Sub Verifier',
            proofSystem: 'Example Proof System',
            mainArithmetization: 'Example Main Arithmetization',
            mainPCS: 'Example Main PCS',
            trustedSetup: 'Example Trusted Setup',
          },
          {
            name: 'Example Sub Verifier 2',
            proofSystem: 'Example Proof System 2',
            mainArithmetization: 'Example Main Arithmetization 2',
            mainPCS: 'Example Main PCS 2',
            trustedSetup: 'Example Trusted Setup 2',
            link: 'https://example.com',
          },
        ],
      },
      {
        name: 'Example Verifier 2',
        description:
          'Reprehenderit incididunt sunt labore ea veniam nostrud incididunt consequat in sit ea reprehenderit. Incididunt laboris est nulla consequat. Velit cupidatat voluptate ipsum deserunt Lorem dolore do quis excepteur est proident in do aliqua. Lorem qui sint id dolor duis. Esse ut magna laborum sint id velit ad non minim magna sunt nisi. Mollit pariatur tempor proident excepteur sint. Proident eu duis nulla commodo adipisicing consequat deserunt proident id duis esse adipisicing est.',
        verified: 'yes',
        contractAddress: EthereumAddress.random(),
        chainId: ChainId.ARBITRUM,
        subVerfiers: [
          {
            name: 'Example Sub Verifier',
            proofSystem: 'Example Proof System',
            mainArithmetization: 'Example Main Arithmetization',
            mainPCS: 'Example Main PCS',
            trustedSetup: 'Example Trusted Setup',
          },
          {
            name: 'Example Sub Verifier 2',
            proofSystem: 'Example Proof System 2',
            mainArithmetization: 'Example Main Arithmetization 2',
            mainPCS: 'Example Main PCS 2',
            link: 'https://example.com',
          },
        ],
      },
      {
        name: 'Example Verifier 3',
        description:
          'Ut nisi incididunt nisi eiusmod et ea cupidatat labore deserunt tempor qui elit quis. Id ea culpa irure tempor non in commodo. Laboris tempor ea ea excepteur nulla consectetur laborum duis. Sint nulla occaecat excepteur pariatur id sint mollit id cillum laboris commodo aliquip duis sunt. Culpa commodo eu eu irure ut labore sint. Id ad ex exercitation reprehenderit id. Occaecat ad nostrud eiusmod cupidatat et anim esse.',
        verified: 'no',
        contractAddress: EthereumAddress.random(),
        chainId: ChainId.ETHEREUM,
        subVerfiers: [
          {
            name: 'Example Sub Verifier',
            proofSystem: 'Example Proof System',
            mainArithmetization: 'Example Main Arithmetization',
            mainPCS: 'Example Main PCS',
          },
          {
            name: 'Example Sub Verifier 2',
            proofSystem: 'Example Proof System 2',
            mainArithmetization: 'Example Main Arithmetization 2',
            mainPCS: 'Example Main PCS 2',
            trustedSetup: 'Example Trusted Setup 2',
            link: 'https://example.com',
          },
        ],
      },
    ],
  },
}
