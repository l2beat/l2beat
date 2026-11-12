import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { EthereumHead, HeadBlock } from '../../live/types'
import { Ref, TYPE, ValueSlot } from './Article'
import { CorrectionNote } from './CorrectionNote'
import { getFinalized } from './facts'
import { formatEthAmount, formatInteger } from './format'
import { type Rewrite, useRewrite } from './useRewrite'

type Token =
  | { kind: 'text'; text: string }
  | {
      kind: 'value'
      id: string
      value: number
      format: (value: number) => string
      /** The replaced block's value, struck through beside the new one */
      old?: number
    }
  | { kind: 'ref' }

/**
 * The page's headline: one sentence about the newest block, with live
 * numbers that roll as blocks land. When a reorg replaces the block it was
 * about, the sentence rewinds to the first word that changed and retypes
 * itself, keeping the old values struck through, like a corrected proof.
 */
export function Lede({ head }: { head: EthereumHead }) {
  const rewrite = useRewrite(head.lastReorg, head.head?.slot)
  const finalized = getFinalized(head)

  if (!head.head || !finalized) return <LedeSkeleton />

  const finalTokens = finalizedTokens(finalized)
  return (
    <div>
      {rewrite ? (
        <RewritingLede rewrite={rewrite} finalTokens={finalTokens} />
      ) : (
        <p className={TYPE.lede}>
          <LiveTokens tokens={sentence(head.head, finalTokens)} />
        </p>
      )}
      {head.lastReorg && (
        <CorrectionNote
          reorg={head.lastReorg}
          active={rewrite !== undefined && rewrite.phase.kind !== 'erase'}
        />
      )}
    </div>
  )
}

function RewritingLede({
  rewrite,
  finalTokens,
}: {
  rewrite: Rewrite
  finalTokens: Token[]
}) {
  const { reorg, phase } = rewrite
  const before = sentence(reorg.replaced, finalTokens)
  const after = sentence(reorg.by, finalTokens, reorg.replaced)
  const from = firstChange(before, after)
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // the tape judders as it runs backwards
  useEffect(() => {
    if (reducedMotion || !ref.current) return
    ref.current.animate(
      [
        { transform: 'none' },
        { transform: 'translateX(-5px) skewX(2deg)', offset: 0.25 },
        { transform: 'translateX(3px) skewX(-1deg)', offset: 0.55 },
        { transform: 'translateX(-1px)', offset: 0.8 },
        { transform: 'none' },
      ],
      { duration: 700, easing: EASE_OUT_QUINT },
    )
  }, [reducedMotion])

  let tokens = after
  let cut: number | undefined
  if (phase.kind === 'erase') {
    tokens = before
    const total = length(before)
    cut = Math.round(total - (total - from) * easeOut(phase.progress))
  } else if (phase.kind === 'type') {
    const total = length(after)
    cut = Math.round(from + (total - from) * phase.progress)
  }

  return (
    <p ref={ref} className={cn(TYPE.lede, 'origin-left')} aria-hidden>
      <CutTokens tokens={tokens} cut={cut} />
    </p>
  )
}

/** Old text stays as a faint ghost past the caret, so the lines don't reflow */
function CutTokens({ tokens, cut }: { tokens: Token[]; cut?: number }) {
  let left = cut ?? Number.POSITIVE_INFINITY
  const nodes: React.ReactNode[] = []
  let caretPlaced = cut === undefined
  const take = (text: string) => {
    const shown = text.slice(0, Math.max(0, left))
    left -= text.length
    return [shown, text.slice(shown.length)] as const
  }
  const piece = (text: string, key: string, className?: string) => {
    const [shown, ghost] = take(text)
    const out: React.ReactNode[] = []
    if (shown) {
      out.push(
        <span key={`${key}-s`} className={className}>
          {shown}
        </span>,
      )
    }
    if (ghost && !caretPlaced) {
      caretPlaced = true
      out.push(<Caret key={`${key}-c`} />)
    }
    if (ghost) {
      out.push(
        <span key={`${key}-g`} className={cn(className, 'opacity-[0.13]')}>
          {ghost}
        </span>,
      )
    }
    return out
  }
  tokens.forEach((token, i) => {
    if (token.kind === 'text') nodes.push(...piece(token.text, `t${i}`))
    else if (token.kind === 'ref')
      nodes.push(<Ref key={`r${i}`} id="finality" />)
    else {
      const text = token.format(token.value)
      if (token.old !== undefined) {
        nodes.push(
          ...piece(token.format(token.old), `o${i}`, STRUCK),
          ...piece(' ', `sp${i}`),
        )
      }
      nodes.push(...piece(text, `v${i}`, VALUE))
    }
  })
  if (!caretPlaced) nodes.push(<Caret key="end" />)
  return <>{nodes}</>
}

function LiveTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) => {
        if (token.kind === 'text') return token.text
        if (token.kind === 'ref') return <Ref key={i} id="finality" />
        return (
          <RollingNumber
            key={token.id}
            value={token.value}
            format={token.format}
            className={VALUE}
          />
        )
      })}
    </>
  )
}

const VALUE = 'font-bold tracking-[-0.03em]'
/** An editor's strike: the replaced block's number, kept visible */
const STRUCK =
  'font-medium text-secondary line-through decoration-brand decoration-[0.09em]'

function Caret() {
  return (
    <span
      aria-hidden
      className="-mr-[3px] relative inline-block h-[0.95em] w-[3px] translate-y-[0.12em] rounded-full bg-brand"
    />
  )
}

function LedeSkeleton() {
  return (
    <p className={TYPE.lede} aria-busy>
      In the last 12 seconds Ethereum settled <ValueSlot chars={2} /> blobs of
      rollup data and <ValueSlot chars={3} /> transactions, burned{' '}
      <ValueSlot chars={6} /> ETH, and finalized everything up to block{' '}
      <ValueSlot chars={10} />.
    </p>
  )
}

function sentence(
  block: HeadBlock,
  finalTokens: Token[],
  replaced?: HeadBlock,
): Token[] {
  if (block.status === 'missed') {
    return [
      text(
        'In the last 12 seconds no block arrived: the validator chosen for slot ',
      ),
      value('slot', block.slot, formatInteger),
      text(' missed its turn. Ethereum has '),
      ...finalTokens,
    ]
  }
  const old = (pick: (b: HeadBlock) => number) =>
    replaced?.status === 'proposed' ? pick(replaced) : undefined
  return [
    text('In the last 12 seconds Ethereum settled '),
    value(
      'blobs',
      block.blobCount,
      formatInteger,
      old((b) => b.blobCount),
    ),
    text(` blob${block.blobCount === 1 ? '' : 's'} of rollup data and `),
    value(
      'txs',
      block.txCount,
      formatInteger,
      old((b) => b.txCount),
    ),
    text(' transactions, burned '),
    value(
      'burned',
      block.burnedEth,
      formatEthAmount,
      old((b) => b.burnedEth),
    ),
    text(' ETH, and '),
    ...finalTokens,
  ]
}

function finalizedTokens(finalized: {
  kind: 'block' | 'slot'
  value: number
}): Token[] {
  return [
    text(`finalized everything up to ${finalized.kind} `),
    value('finalized', finalized.value, formatInteger),
    text('.'),
    { kind: 'ref' },
  ]
}

function text(value: string): Token {
  return { kind: 'text', text: value }
}

function value(
  id: string,
  amount: number,
  format: (value: number) => string,
  old?: number,
): Token {
  const changed = old !== undefined && format(old) !== format(amount)
  return {
    kind: 'value',
    id,
    value: amount,
    format,
    old: changed ? old : undefined,
  }
}

function tokenLength(token: Token) {
  if (token.kind === 'text') return token.text.length
  if (token.kind === 'ref') return 0
  const own = token.format(token.value).length
  return token.old === undefined
    ? own
    : own + token.format(token.old).length + 1
}

function length(tokens: Token[]) {
  return tokens.reduce((total, t) => total + tokenLength(t), 0)
}

/** Characters before the first value the replacement changed */
function firstChange(before: Token[], after: Token[]) {
  let at = 0
  for (const [i, token] of after.entries()) {
    const was = before[i]
    const same =
      token.kind === 'value'
        ? token.old === undefined &&
          was?.kind === 'value' &&
          was.format(was.value) === token.format(token.value)
        : token.kind === was?.kind &&
          (token.kind !== 'text' ||
            (was.kind === 'text' && was.text === token.text))
    if (!same) return at
    at += tokenLength(token)
  }
  return at
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}
