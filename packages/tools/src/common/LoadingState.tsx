export function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-mono text-orange-500">
      <div className="pixelated mb-8 grid h-64 w-64 grid-cols-10 gap-1">
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            style={{
              // @ts-expect-error
              '--pixel-index': index.toString(),
            }}
            className="pixel-animate h-full w-full bg-gray-600"
          />
        ))}
      </div>
      <div className="text-2xl">
        Loading<span className="animate-blink">_</span>
      </div>
    </div>
  )
}
