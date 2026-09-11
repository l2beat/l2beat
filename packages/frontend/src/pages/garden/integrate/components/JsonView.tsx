import { Fragment, type ReactNode } from 'react'
import {
  type ElisionKind,
  type ExampleValue,
  getElision,
} from '../exampleValue'

const TOKEN = {
  key: 'text-[#0d5aa7] dark:text-[#7cc4ff]',
  string: 'text-[#16863f] dark:text-[#3fe07f]',
  number: 'text-[#b06a00] dark:text-[#ffb454]',
  keyword: 'text-[#7e41cc] dark:text-[#db8bf7]',
  punct: 'text-[#8b9099] dark:text-[#6b7079]',
  elision: 'text-[#a6abb3] dark:text-[#5a5f68]',
}

const ELISION_TEXT: Record<ElisionKind, string> = {
  value: '…',
  object: '{ … }',
  array: '[ … ]',
}

/** Pretty-printed JSON coloured by structure, so no lexer has to guess what a token is. */
export function JsonView({ value }: { value: ExampleValue }) {
  return <Node value={value} depth={0} />
}

function Node({ value, depth }: { value: ExampleValue; depth: number }) {
  const elision = getElision(value)
  if (elision) {
    return <span className={TOKEN.elision}>{ELISION_TEXT[elision]}</span>
  }
  if (value === null || typeof value === 'boolean') {
    return <span className={TOKEN.keyword}>{String(value)}</span>
  }
  if (typeof value === 'number') {
    return <span className={TOKEN.number}>{String(value)}</span>
  }
  if (typeof value === 'string') {
    return <span className={TOKEN.string}>{JSON.stringify(value)}</span>
  }
  if (Array.isArray(value)) {
    return (
      <Block
        open="["
        close="]"
        depth={depth}
        items={value.map((item, index) => (
          // Positional: the index is the identity of a JSON entry.
          <Node key={index} value={item} depth={depth + 1} />
        ))}
      />
    )
  }
  return (
    <Block
      open="{"
      close="}"
      depth={depth}
      items={Object.entries(value).map(([key, item]) => (
        <Fragment key={key}>
          <span className={TOKEN.key}>{JSON.stringify(key)}</span>
          <span className={TOKEN.punct}>: </span>
          <Node value={item} depth={depth + 1} />
        </Fragment>
      ))}
    />
  )
}

function Block({
  open,
  close,
  depth,
  items,
}: {
  open: string
  close: string
  depth: number
  items: ReactNode[]
}) {
  if (items.length === 0) {
    return <span className={TOKEN.punct}>{`${open}${close}`}</span>
  }
  const indent = '  '.repeat(depth + 1)
  return (
    <>
      <span className={TOKEN.punct}>{open}</span>
      {'\n'}
      {items.map((item, index) => (
        // Positional: the index is the identity of a JSON entry.
        <Fragment key={index}>
          {indent}
          {item}
          {index < items.length - 1 && <span className={TOKEN.punct}>,</span>}
          {'\n'}
        </Fragment>
      ))}
      {'  '.repeat(depth)}
      <span className={TOKEN.punct}>{close}</span>
    </>
  )
}
