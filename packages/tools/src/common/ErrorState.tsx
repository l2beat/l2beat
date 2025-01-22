export function ErrorState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-mono text-red-500">
      <div className="pixelated mb-8 grid h-64 w-64 grid-cols-8 gap-1">
        {Array.from({ length: 64 }).map((_, index) => (
          <div key={index} className="h-full w-full bg-red-500" />
        ))}
      </div>
      <div className="text-2xl">Error ☠️</div>
      <div>Please report to the developer team.</div>
    </div>
  )
}
