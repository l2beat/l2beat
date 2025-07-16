export function CountdownSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-brand bg-surface-primary px-4 py-8 max-md:border-x-0 max-md:bg-brand/25 md:mt-4 md:rounded-lg md:border-2 md:p-6 max-md:dark:bg-brand/15">
      {children}
    </div>
  )
}
