// Step 7's conversations with the agent. They live outside React so that leaving the step to follow
// a citation and coming back keeps them, and so a running question keeps streaming meanwhile.

import { useSyncExternalStore } from 'react'
import type { AskEvent } from '../../shared/types'
import { api } from '../api'

export interface Turn {
  question: string
  model: string
  effort: string
  events: AskEvent[]
  /** The agent's last message. */
  answer?: string
  status: 'running' | 'done' | 'error'
  error?: string
  ms?: number
  usage?: Record<string, number>
  transcript?: string
  /** How codex was started, for the curious. */
  command?: string
  startedAt: number
}

export interface Conversation {
  runId: string
  turns: Turn[]
  /** Codex thread of this conversation; follow-ups resume it. */
  threadId?: string
  running: boolean
  model?: string
  effort?: string
}

const conversations = new Map<string, Conversation>()
const controllers = new Map<string, AbortController>()
const listeners = new Set<() => void>()

function get(runId: string): Conversation {
  let c = conversations.get(runId)
  if (!c) {
    c = { runId, turns: [], running: false }
    conversations.set(runId, c)
  }
  return c
}

function update(runId: string, fn: (c: Conversation) => Conversation): void {
  conversations.set(runId, fn(get(runId)))
  for (const l of listeners) l()
}

function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function useConversation(runId: string): Conversation {
  return useSyncExternalStore(
    subscribe,
    () => get(runId),
    () => get(runId),
  )
}

export function setModelChoice(
  runId: string,
  model: string,
  effort: string,
): void {
  update(runId, (c) => ({ ...c, model, effort }))
}

function applyEvent(t: Turn, event: AskEvent): Turn {
  const next: Turn = { ...t, events: [...t.events, event] }
  switch (event.type) {
    case 'started':
      next.command = event.command
      break
    case 'message':
      next.answer = event.text
      break
    case 'error':
      next.error = event.message
      next.status = 'error'
      break
    case 'done':
      next.ms = event.ms
      next.usage = event.usage
      next.transcript = event.transcript
      if (next.status === 'running')
        next.status = next.answer ? 'done' : 'error'
      if (next.status === 'error' && !next.error)
        next.error = `the agent ended without an answer (exit code ${event.exitCode ?? 'none'})`
      break
    default:
      break
  }
  return next
}

/** Sends one question (a follow-up if the conversation already has a thread) and streams the turn in. */
export async function askQuestion(
  runId: string,
  req: { question: string; model: string; effort: string },
): Promise<void> {
  const conversation = get(runId)
  if (conversation.running) return
  const controller = new AbortController()
  controllers.set(runId, controller)
  const turn: Turn = {
    ...req,
    events: [],
    status: 'running',
    startedAt: Date.now(),
  }
  update(runId, (c) => ({ ...c, running: true, turns: [...c.turns, turn] }))
  const patchLast = (fn: (t: Turn) => Turn) =>
    update(runId, (c) => ({
      ...c,
      turns: c.turns.map((t, i) => (i === c.turns.length - 1 ? fn(t) : t)),
    }))
  try {
    await api.ask(
      { runId, ...req, threadId: conversation.threadId },
      (event) => {
        if (event.type === 'started' && event.threadId)
          update(runId, (c) => ({ ...c, threadId: event.threadId }))
        patchLast((t) => applyEvent(t, event))
      },
      controller.signal,
    )
  } catch (e) {
    patchLast((t) => ({
      ...t,
      status: 'error',
      error: controller.signal.aborted
        ? 'cancelled'
        : e instanceof Error
          ? e.message
          : String(e),
    }))
  } finally {
    controllers.delete(runId)
    update(runId, (c) => ({ ...c, running: false }))
    patchLast((t) =>
      t.status === 'running'
        ? {
            ...t,
            status: t.answer ? 'done' : 'error',
            error: t.answer
              ? undefined
              : (t.error ?? 'the stream ended without an answer'),
          }
        : t,
    )
  }
}

export function cancelQuestion(runId: string): void {
  controllers.get(runId)?.abort()
}

/** Forgets the turns and the thread; the transcripts in the run folder stay. */
export function resetConversation(runId: string): void {
  if (get(runId).running) return
  update(runId, (c) => ({ ...c, turns: [], threadId: undefined }))
}
