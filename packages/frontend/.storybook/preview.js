import { withScreenshot } from 'storycap'
import '../src/styles/main.scss'
import '../src/styles/style.css'

document.body.classList.add(
  'bg-white',
  'text-black',
  'dark:bg-black',
  'dark:text-white',
)

export const decorators = [withScreenshot]

export const parameters = {
  screenshot: {
    viewports: {
      mobile: {
        width: 390,
        height: 844,
      },
      large: {
        width: 2560,
        height: 1440,
      },
    },
    delay: 100,
  },
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
