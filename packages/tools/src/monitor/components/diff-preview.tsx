export function DiffPreview({ diff }: { diff: string }) {
  const lines = diff.split('\n')
  const lineNumberWidth = `${String(lines.length).length}.25em`
  return (
    <pre className="my-2 max-w-full overflow-auto rounded-[0.3rem] bg-[#1e1e1e] p-4 font-mono text-[#d4d4d4] text-[13px] leading-normal">
      {lines.map((line, index) => (
        <div
          key={index}
          className={`flex whitespace-pre-wrap break-all ${getLineClassName(line)}`}
        >
          <span
            className="shrink-0 select-none pr-[1em] text-right text-[#6a9955]"
            style={{ minWidth: lineNumberWidth }}
          >
            {index + 1}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </pre>
  )
}

function getLineClassName(line: string): string {
  if (line.startsWith('+++')) {
    return 'bg-[#182618]'
  }
  if (line.startsWith('---')) {
    return 'bg-[#261818]'
  }
  if (line.startsWith('+')) {
    return 'bg-[#182618] text-[#b5cea8]'
  }
  if (line.startsWith('-')) {
    return 'bg-[#261818] text-[#ce9178]'
  }
  return ''
}
