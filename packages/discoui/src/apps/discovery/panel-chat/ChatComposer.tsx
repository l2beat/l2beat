import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react'
import { IconArrowUp } from '../../../icons/IconArrowUp'
import { IconStop } from '../../../icons/IconStop'
import { cn } from '../../../utils/cn'
import type { Send } from './ChatMessages'
import { ConfigPicker, type Switch } from './ConfigPicker'

// Grows with the message up to this, then scrolls.
const INPUT_HEIGHT_MAX_PX = 200

export function ChatComposer(props: { isWorking: boolean; send: Send }) {
  const [text, setText] = useState('')
  // A second Enter or click before the first answer would send it twice.
  const [isSending, setSending] = useState(false)
  // A message sent while the model switches could reach the old one.
  const [switching, setSwitching] = useState<Switch>()
  const input = useAutoHeight(text)

  const canSend =
    text.trim().length > 0 &&
    !props.isWorking &&
    !isSending &&
    switching === undefined
  const submit = () => {
    if (!canSend) {
      return
    }
    setSending(true)
    // A refused message stays in the box to edit and send again.
    // Text typed while the request was on its way stays too.
    const sent = text
    void props
      .send('prompt', { text: sent })
      .then((isTaken) => {
        if (isTaken) setText((current) => (current === sent ? '' : current))
      })
      .finally(() => setSending(false))
  }

  return (
    <div className="p-2 pt-0">
      <div className="flex flex-col rounded-lg border border-coffee-600 bg-coffee-800 transition-colors focus-within:border-coffee-400">
        <textarea
          ref={input}
          rows={1}
          value={text}
          placeholder="Ask about this project…"
          aria-label="Message the agent"
          title="Enter sends, Shift+Enter adds a line"
          className="resize-none bg-transparent px-3 pt-2.5 pb-1 text-[13px] text-coffee-100 leading-relaxed placeholder:text-coffee-400 focus:outline-hidden"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (isSubmitKey(event)) {
              event.preventDefault()
              submit()
            }
          }}
        />
        <div className="flex items-center gap-2 px-2 pb-2">
          <ConfigPicker
            isWorking={props.isWorking}
            switching={switching}
            setSwitching={setSwitching}
            send={props.send}
          />
          <SendButton
            isWorking={props.isWorking}
            canSend={canSend}
            submit={submit}
            stop={() => props.send('cancel')}
          />
        </div>
      </div>
    </div>
  )
}

// Enter also confirms text typed through an input method, which must not
// send; Shift+Enter adds a line.
function isSubmitKey(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing
  )
}

function useAutoHeight(text: string) {
  const input = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const element = input.current
    if (element === null) {
      return
    }
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, INPUT_HEIGHT_MAX_PX)}px`
  }, [text])
  return input
}

function SendButton(props: {
  isWorking: boolean
  canSend: boolean
  submit: () => void
  stop: () => void
}) {
  if (props.isWorking) {
    return (
      <button
        type="button"
        title="Stop"
        aria-label="Stop"
        onClick={props.stop}
        className="flex size-7 items-center justify-center rounded-full bg-coffee-600 text-coffee-100 transition-colors hover:bg-coffee-500"
      >
        <IconStop className="size-3" />
      </button>
    )
  }
  return (
    <button
      type="button"
      title="Send"
      aria-label="Send"
      disabled={!props.canSend}
      onClick={props.submit}
      className={cn(
        'flex size-7 items-center justify-center rounded-full transition-colors',
        props.canSend
          ? 'bg-autumn-300 text-black hover:bg-autumn-200'
          : 'bg-coffee-700 text-coffee-500',
      )}
    >
      <IconArrowUp className="size-3.5" />
    </button>
  )
}
