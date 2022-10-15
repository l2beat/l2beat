export function onRadioChange(
  inputs: HTMLInputElement[] | NodeListOf<HTMLInputElement>,
  onChange: (input: HTMLInputElement) => void,
) {
  for (const input of Array.from(inputs)) {
    input.addEventListener('change', () => {
      if (input.checked) {
        onChange(input)
      }
    })
  }
}
