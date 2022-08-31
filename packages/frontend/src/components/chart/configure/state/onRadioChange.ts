export function onRadioChange(
  inputs: HTMLInputElement[],
  onChange: (input: HTMLInputElement) => void,
) {
  for (const input of inputs) {
    input.addEventListener('change', () => {
      if (input.checked) {
        onChange(input)
      }
    })
  }
}
