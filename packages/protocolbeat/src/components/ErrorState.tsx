export function ErrorState() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center">
      <div className="flex max-h-[100px] w-full flex-col items-center justify-center gap-1 font-mono text-aux-red/450 italic">
        <HeartCrack />
        Something went wrong
      </div>
    </div>
  )
}

function HeartCrack() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-aux-red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="m12 13-1-1 2-2-3-3 2-2" />
    </svg>
  )
}
