import {
  type BadgeId,
  BadgeType,
  badges,
} from '@l2beat/config/build/src/projects/badges'
import { type StoryObj } from '@storybook/react'
import { ProjectBadge } from './project-badge'

const meta = {
  title: 'UI/Projects/Project Badge',
}
export default meta

type Story = StoryObj<typeof meta>

export const VM: Story = {
  render: () => <Template type={BadgeType.VM} />,
}

export const DA: Story = {
  render: () => <Template type={BadgeType.DA} />,
}

export const Stack: Story = {
  render: () => <Template type={BadgeType.Stack} />,
}

export const Fork: Story = {
  render: () => <Template type={BadgeType.Fork} />,
}

export const Infra: Story = {
  render: () => <Template type={BadgeType.Infra} />,
}

export const L3ParentChain: Story = {
  name: 'L3 Parent Chain',
  render: () => <Template type={BadgeType.L3ParentChain} />,
}

export const Other: Story = {
  render: () => <Template type={BadgeType.Other} />,
}

export const RaaS: Story = {
  name: 'RaaS',
  render: () => <Template type={BadgeType.RaaS} />,
}

function Template({ type }: { type: BadgeType }) {
  const badgesIds = Object.keys(badges).filter(
    (v) => badges[v as BadgeId].type === type,
  )
  return (
    <div className="flex flex-wrap gap-2">
      {badgesIds.map((id) => {
        const badgeId = id as BadgeId
        return <ProjectBadge key={id} id={badgeId} />
      })}
    </div>
  )
}
