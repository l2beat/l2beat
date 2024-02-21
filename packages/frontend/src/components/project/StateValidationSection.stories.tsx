import { Meta, StoryObj } from '@storybook/react'

import { StateValidationSection } from './StateValidationSection'

const meta: Meta<typeof StateValidationSection> = {
  component: StateValidationSection,
  args: {
    id: 'state-validation',
    title: 'State Validation',
    stateValidation: {
      description:
        'Quis exercitation non cupidatat dolor aute do deserunt amet aute labore qui commodo mollit. Ex minim ea pariatur aliqua sint et excepteur aliquip veniam id. Irure non Lorem laborum laboris.',
      categories: [
        {
          title: 'Prover Architecture',
          description:
            'zkSync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/docs/specs/prover).',
        },
        {
          title: 'ZK Circuits',
          description:
            'zkSync Era circuits are built from Boojum and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/matter-labs/era-zkevm_circuits/tree/main). The circuits are checked against tests that can be found [here](https://github.com/matter-labs/era-zkevm_test_harness/tree/main).',
        },
        {
          title: 'Verification Keys Generation',
          description:
            'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this tool](https://github.com/matter-labs/zksync-era/tree/main/prover/vk_setup_data_generator_server_fri). The system requires a trusted setup.',
        },
      ],
    },
    sectionOrder: 1,
  },
}
export default meta
type Story = StoryObj<typeof StateValidationSection>

export const Primary: Story = {}
