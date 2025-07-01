export function LiveIndicator() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex size-2 rounded-full bg-negative"></span>
    </span>
  )
}
