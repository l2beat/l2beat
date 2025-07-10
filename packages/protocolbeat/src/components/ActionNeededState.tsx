export function ActionNeededState(props: { message: string }) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center">
      <div className="flex max-h-[100px] w-full items-center justify-center gap-2 font-mono text-aux-red/450 italic">
        <OctagonAlert />
        {props.message}
      </div>
    </div>
  )
}

function OctagonAlert() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-aux-amber"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16h.01" />
      <path d="M12 8v4" />
      <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
    </svg>
  )
}
