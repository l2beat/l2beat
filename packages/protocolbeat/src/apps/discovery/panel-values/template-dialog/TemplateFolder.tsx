import clsx from 'clsx'
import { useState } from 'react'
import { IconContract } from '../../../../icons/IconContract'
import { IconFolder } from '../../../../icons/IconFolder'
import { IconFolderOpened } from '../../../../icons/IconFolderOpened'

export function TemplateFolder({
  name,
  entries,
  selected,
  setSelected,
}: {
  name: string
  entries: string[]
  selected: string
  setSelected: (selected: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)

  if (entries.length === 0) {
    return (
      <div
        className="flex cursor-pointer items-center gap-2 hover:bg-coffee-400/20"
        onClick={() => setSelected(name)}
      >
        <IconContract />
        <span
          className={clsx('text-sm', selected === name && 'text-coffee-300')}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <div className="mb-0.5 flex flex-col">
      <div className="group flex cursor-pointer items-center gap-2 hover:bg-coffee-400/20">
        <div onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IconFolderOpened /> : <IconFolder />}
        </div>
        <span
          className={clsx(
            'w-full text-sm group-hover:text-coffee-300',
            selected === name && 'text-coffee-300',
          )}
          onClick={() => setSelected(name)}
        >
          {name}
        </span>
      </div>
      {isOpen && (
        <div className="ml-2 flex flex-col border-l">
          {entries.map((entry) => {
            const key = `${name}/${entry}`
            return (
              <span
                key={key}
                className={clsx(
                  'w-full cursor-pointer pl-5 text-xs hover:bg-coffee-400/20 hover:text-coffee-300',
                  selected === key && 'text-coffee-300',
                )}
                onClick={() => setSelected(key)}
              >
                {entry}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
