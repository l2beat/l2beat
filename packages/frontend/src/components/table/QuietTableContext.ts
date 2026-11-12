import { createContext } from 'react'

/**
 * Set by a quiet `BasicTable` (see its `quiet` prop), for the cells that take
 * the home page's look from the table rather than through a prop: links with
 * a full-height square hover, ranks as small print, names at medium weight.
 */
export const QuietTableContext = createContext(false)
