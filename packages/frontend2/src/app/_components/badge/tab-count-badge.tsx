export function TabCountBadge({ children }: { children: number }) {
  return (
    <span className="flex items-center justify-center rounded-full bg-purple-100 px-1.5 py-0.5 text-2xs text-white leading-none md:text-xs">
      {children}
    </span>
  )
}
