export function Tooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative w-fit">
      {children}
      <div
        role="tooltip"
        className="-translate-x-1/2 invisible absolute bottom-full left-1/2 z-10 mb-2 whitespace-nowrap rounded-lg bg-gray-700 px-3 py-2 font-medium text-sm text-white opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100"
      >
        {content}
      </div>
    </div>
  )
}
