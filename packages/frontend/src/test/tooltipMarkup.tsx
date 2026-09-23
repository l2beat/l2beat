import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'

// Radix renders tooltip content only after hover, so tooltip tests render on
// the server, like the SSR entry does, and inspect the markup a crawler or an
// LLM receives without any client interaction.
export function renderOnServer(node: ReactNode) {
  return renderToString(<TooltipProvider>{node}</TooltipProvider>)
}

/**
 * Finds the element that the tooltip trigger points to via aria-describedby
 * and returns its classes and text.
 */
export function getTooltipTriggerDescription(html: string) {
  // Closed Radix tooltips set no aria-describedby, so any one is ours.
  const id = html.match(/aria-describedby="([^"]+)"/)?.[1]
  if (!id) throw new Error('Tooltip trigger has no aria-describedby')

  const element = getElementById(html, id)
  return {
    className: element.match(/^<[^>]*class="([^"]*)"/)?.[1] ?? '',
    text: element
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  }
}

function getElementById(html: string, id: string) {
  const start = html.indexOf(`id="${id}"`)
  const openStart = html.lastIndexOf('<', start)
  const tag = html.slice(openStart + 1).match(/^\w+/)?.[0]
  if (start === -1 || !tag) throw new Error(`No element with id ${id}`)

  // Walk to the matching close tag, counting nested tags of the same name.
  const tagPattern = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g')
  tagPattern.lastIndex = openStart
  let depth = 0
  for (const match of html.matchAll(tagPattern)) {
    if (match.index < openStart) continue
    depth += match[1] ? -1 : 1
    if (depth === 0) return html.slice(openStart, match.index + match[0].length)
  }
  throw new Error(`Element with id ${id} is not closed`)
}
