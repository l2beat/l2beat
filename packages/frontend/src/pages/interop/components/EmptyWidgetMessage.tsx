export function EmptyWidgetMessage({ children }: { children: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      {children}
    </div>
  )
}
