import { type ProjectDetailsSection } from './types'

export interface GroupSectionProps {
  // This is a circular ref, but it's fine
  items: ProjectDetailsSection[]
  id: string
  title: string
  sectionOrder: number
}

export function GroupSection({ items }: GroupSectionProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base lg:min-w-[400px]">
      {items.map((item) => (
        <div key={item.type}>{item.type}</div>
      ))}
    </div>
  )
}
