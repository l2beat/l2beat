import { withThemeByDataAttribute } from '@storybook/addon-styling'
import { ScreenshotOptions, withScreenshot } from 'storycap'
import '../src/styles/main.scss'
import '../src/styles/style.css'

document.body.classList.add(
  'bg-white',
  'text-black',
  'dark:bg-black',
  'dark:text-white',
)

export const decorators = [
  withScreenshot,
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'class',
  }),
]

const screenshotOptions: ScreenshotOptions = {
  delay: 50,
  viewports: {
    mobile: {
      width: 390,
      height: 844,
      isMobile: true,
    },
    large: {
      width: 2560,
      height: 1440,
    },
  },
}
export const parameters = {
  screenshot: screenshotOptions,
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
