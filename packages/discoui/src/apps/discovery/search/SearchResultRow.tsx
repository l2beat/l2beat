import type { FC } from 'react'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconCode } from '../../../icons/IconCode'
import { IconContract } from '../../../icons/IconContract'
import { IconEoa } from '../../../icons/IconEoa'
import { IconFolder } from '../../../icons/IconFolder'
import { IconSearch } from '../../../icons/IconSearch'
import { IconSigma } from '../../../icons/IconSigma'
import { cn } from '../../../utils/cn'
import { Keys } from '../multi-view/BottomBar/Keys'
import type { SearchItem } from './items'
import { highlightSegments } from './rank'

export function SearchResultRow(props: {
  item: SearchItem
  index: number
  needles: string[]
  highlighted: boolean
  onHighlight: (index: number) => void
  onRun: (item: SearchItem) => void
}) {
  const { item } = props
  const Icon = iconFor(item)
  return (
    <div
      data-index={props.index}
      onMouseMove={() => {
        if (!props.highlighted) props.onHighlight(props.index)
      }}
      onClick={() => props.onRun(item)}
      className={cn(
        'flex h-7 cursor-pointer items-center gap-2.5 px-3 text-[13px]',
        props.highlighted
          ? 'bg-coffee-700 shadow-[inset_2px_0_0_#BAD80A]'
          : 'text-coffee-200',
      )}
    >
      <Icon className="size-3.5 shrink-0 text-coffee-400" />
      <span
        className={cn(
          'min-w-0 shrink truncate',
          item.kind === 'code'
            ? 'font-mono text-coffee-200 text-xs'
            : 'font-medium text-coffee-100',
          item.kind === 'scope' && 'font-normal text-coffee-300',
        )}
      >
        <Highlighted text={item.title} needles={props.needles} />
      </span>
      {item.detail !== '' && (
        <span className="min-w-0 shrink-[2] truncate text-coffee-400 text-xs">
          <Highlighted text={item.detail} needles={props.needles} />
        </span>
      )}
      <span className="ml-auto shrink-0 font-mono text-coffee-400 text-xs">
        {item.trailing}
      </span>
      {item.kind === 'command' && item.shortcut !== '' && (
        <Keys keys={[item.shortcut]} />
      )}
    </div>
  )
}

function Highlighted(props: { text: string; needles: string[] }) {
  return highlightSegments(props.text, props.needles).map((segment, i) =>
    segment.highlighted ? (
      <span key={i} className="text-autumn-300">
        {segment.text}
      </span>
    ) : (
      segment.text
    ),
  )
}

function iconFor(item: SearchItem): FC<{ className?: string }> {
  switch (item.kind) {
    case 'contract':
      return item.isEoa ? IconEoa : IconContract
    case 'field':
      return IconSigma
    case 'project':
      return IconFolder
    case 'command':
      return IconChevronRight
    case 'code':
      return IconCode
    case 'scope':
      return IconSearch
  }
}
