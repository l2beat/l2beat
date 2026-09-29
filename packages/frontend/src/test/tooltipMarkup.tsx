import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'

// Radix renders tooltip content only after hover, so tooltip tests render on
// the server, like the SSR entry does, and inspect the markup a crawler or an
// LLM receives without any client interaction.
export function renderOnServer(node: ReactNode) {
  return renderToString(<TooltipProvider>{node}</TooltipProvider>)
}

export function getTooltipTriggerDescription(html: string) {
  // Tests render a single tooltip, so the first reference is its trigger's.
  const id = html.match(/aria-describedby="([^"]+)"/)?.[1]
  if (!id) throw new Error('Tooltip trigger has no aria-describedby')

  const element = sliceElementById(html, id)
  return {
    className: element.match(/^<[^>]*class="([^"]*)"/)?.[1] ?? '',
    text: element
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  }
}

function sliceElementById(html: string, id: string) {
  const idIndex = html.indexOf(`id="${id}"`)
  if (idIndex === -1) throw new Error(`No element with id ${id}`)
  return sliceElementStartingAt(html, html.lastIndexOf('<', idIndex))
}

function sliceElementStartingAt(html: string, openStart: number) {
  const tag = html.slice(openStart + 1).match(/^\w+/)?.[0]
  if (!tag) throw new Error(`No tag at ${openStart}`)

  let depth = 0
  const tags = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g')
  for (const match of html.slice(openStart).matchAll(tags)) {
    depth += match[1] ? -1 : 1
    if (depth === 0) {
      return html.slice(openStart, openStart + match.index + match[0].length)
    }
  }
  throw new Error(`<${tag}> at ${openStart} is not closed`)
}
