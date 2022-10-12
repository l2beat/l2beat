import { fill } from './draw/fill'
import { stroke } from './draw/stroke'
import { getMainStyle, getSecondaryStyle } from './draw/style'
import { Outputs } from './getOutputs'
import { UiState } from './ui'

export function plot(uiState: UiState | undefined, outputs: Outputs) {
  if (!uiState) {
    outputs.loader.classList.remove('hidden')
    return
  }
  outputs.loader.classList.add('hidden')

  outputs.range.innerHTML = uiState.dateRange
  for (let i = 0; i < 5; i++) {
    outputs.labels[i].innerHTML = uiState.labels[4 - i]
  }

  const canvas = outputs.canvas
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!
  const box = canvas.getBoundingClientRect()
  canvas.width = box.width * window.devicePixelRatio
  canvas.height = box.height * window.devicePixelRatio

  const secondaryStyle = getSecondaryStyle(canvas, ctx)
  const mainStyle = getMainStyle(canvas, ctx)

  if (uiState.secondaryPoints) {
    fill(ctx, uiState.secondaryPoints, canvas, secondaryStyle.fillGradient, {
      fade: true,
    })
    fill(ctx, uiState.mainPoints, canvas, mainStyle.fillGradient)
    stroke(ctx, uiState.secondaryPoints, canvas, secondaryStyle.strokeGradient)
    stroke(ctx, uiState.mainPoints, canvas, mainStyle.strokeGradient)
  } else {
    fill(ctx, uiState.mainPoints, canvas, mainStyle.fillGradient)
    stroke(ctx, uiState.mainPoints, canvas, mainStyle.strokeGradient)
  }
}
