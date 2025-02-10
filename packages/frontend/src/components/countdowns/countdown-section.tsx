export function CountdownSection({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="border-brand bg-surface-primary p-4 max-md:border-x-0 max-md:bg-brand/25 max-md:dark:bg-brand/15 md:mt-10 md:rounded-lg md:border-2 md:p-8">
      {children}
    </div>
  )
}
