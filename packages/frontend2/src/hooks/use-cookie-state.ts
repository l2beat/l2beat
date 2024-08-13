'use client'

import { useEffect, useState } from 'react'
import { type KnownCookieName, type KnownCookieValue } from '~/consts/cookies'
import { getCookie } from '~/utils/cookies/client'

type CookieEvent = {
  name: KnownCookieName
  value: KnownCookieValue<KnownCookieName>
}

/**
 * Use state that is persisted in a cookie.
 * @param name known cookie name
 * @returns array containing the current value and a function to update it
 */
export function useCookieState<Name extends KnownCookieName>(
  name: Name,
): [KnownCookieValue<Name>, (value: KnownCookieValue<Name>) => void] {
  const [state, setState] = useState<KnownCookieValue<Name>>(
    getCookie<Name>(name),
  )

  useEffect(() => {
    const listener = (event: Event) => {
      if (!(event instanceof CustomEvent)) return

      const cookieEvent = event as CustomEvent<CookieEvent>

      if (cookieEvent.detail.name === name) {
        setState(cookieEvent.detail.value)
      }
    }

    document.addEventListener('cookie', listener)

    return () => {
      document.removeEventListener('cookie', listener)
    }
  }, [name])

  return [
    state,
    (state) => {
      document.dispatchEvent(
        new CustomEvent('cookie', {
          detail: {
            name,
            value: state,
          },
        }),
      )
    },
  ]
}
