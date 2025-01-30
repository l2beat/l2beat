import type { BadgeId } from '@l2beat/config'
import { BadgeType, badges } from '@l2beat/config'
import type { StoryObj } from '@storybook/react'
import { ProjectBadge } from './project-badge'

const meta = {
  title: 'Components/Projects',
}
export default meta

type Story = StoryObj<typeof meta>
export const ProjectBadges: Story = {
  render: () => (
    <div className="space-y-4">
      {Object.values(BadgeType).map((type) => (
        <Template key={type} type={type} />
      ))}
    </div>
  ),
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
