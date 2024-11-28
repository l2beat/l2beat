import { ComponentType, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CounterApp } from './counter/CounterApp'
import { ToggleApp } from './toggle/ToggleApp'

export function setupApps() {
  setupApp('counter', CounterApp)
  setupApp('toggle', ToggleApp)
}

declare const APP_DATA: Record<number, unknown>

// biome-ignore lint/suspicious/noExplicitAny: We allow every component
function setupApp(type: string, Component: ComponentType<any>) {
  const appElements = document.querySelectorAll<HTMLElement>(
    `[data-app="${type}"]`,
  )
  for (const element of appElements) {
    const id = Number(element.dataset.appId)
    // biome-ignore lint/suspicious/noExplicitAny: We assume it's there and a correct type
    const props = APP_DATA[id] as any
    createRoot(element).render(
      <StrictMode>
        <Component {...props} />
      </StrictMode>,
    )
  }
}
