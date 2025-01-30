import type { Meta, StoryObj } from '@storybook/react'
import { PentagonRosetteTooltip } from './pentagon-rosette-tooltip'

const meta = {
  title: 'Components/Tooltip/Pentagon Rosette',
  component: PentagonRosetteTooltip,
} satisfies Meta<typeof PentagonRosetteTooltip>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    values: [
      {
        name: 'Sequencer failure',
        value: 'Self sequence',
        sentiment: 'good',
        description:
          "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 1d delay on this operation.",
        warning: undefined,
      },
      {
        name: 'State validation',
        value: 'Fraud proofs (INT)',
        sentiment: 'warning',
        description:
          'Fraud proofs allow 14 WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. There is a 6d 8h challenge period.',
        warning: undefined,
      },
      {
        name: 'Data availability',
        value: 'On chain',
        sentiment: 'good',
        description:
          'All of the data needed for proof construction is published on Ethereum L1.',
        warning: {
          value: 'Some random data availability warning',
          sentiment: 'warning',
        },
      },
      {
        name: 'Exit window',
        value: '2d',
        sentiment: 'bad',
        description:
          'Non-emergency upgrades are initiated on L2 and go through a 3d delay. Since there is a 1d delay to force a tx (forcing the inclusion in the following state update), users have only 2d to exit. \n' +
          '    \n' +
          '  If users post a tx after that time, they would only be able to self propose a state root 12d 17h after the last state root was proposed and then wait for the 6d 8h challenge window, while the upgrade would be confirmed just after the 6d 8h challenge window and the 3d L1 timelock.',
        warning: undefined,
      },
      {
        name: 'Proposer failure',
        value: 'Self propose',
        sentiment: 'good',
        description:
          'Anyone can become a Proposer after 12d 17h of inactivity from the currently whitelisted Proposers.',
        warning: undefined,
      },
    ],
  },
}
