import '../src/styles/style.css'
import '../src/styles/main.scss'

document.body.classList.add(
  'bg-white',
  'text-black',
  'dark:bg-black',
  'dark:text-white',
)

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    classTarget: 'html',
    stylePreview: true,
  },
}
