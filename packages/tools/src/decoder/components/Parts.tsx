import clsx from 'clsx'

export interface PartsProps {
  value: string
}

export function Parts({ value }: PartsProps) {
  const bytes = toParts(value)
  return (
    <>
      {bytes.map((parts, i) => (
        <div key={i}>
          {parts.map((p, j) => (
            <span className={clsx(p.isZero && 'text-zinc-600')} key={j}>
              {p.value}
            </span>
          ))}
        </div>
      ))}
    </>
  )
}

interface Part {
  value: string
  isZero: boolean
}

function toParts(value: string) {
  const length = Math.ceil(value.length / 64)
  return Array.from({ length }).map((_, i) => {
    const slice = value.slice(i * 64, (i + 1) * 64)
    let part: Part = { value: '', isZero: false }
    const parts: Part[] = [part]
    for (let i = 0; i < 64; i += 2) {
      const byte = slice.slice(i, i + 2)
      const isZero = byte === '00'
      if (i === 0 || isZero === part.isZero) {
        part.value += byte
        part.isZero = isZero
      } else {
        part = { value: byte, isZero }
        parts.push(part)
      }
    }
    return parts
  })
}
