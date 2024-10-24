import { type ProjectDetailsSection, type ProjectSectionProps } from './types'

export interface GroupSectionProps extends ProjectSectionProps {
  // This is a circular ref, but it's fine
  items: ProjectDetailsSection[]
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
