export function onCheckboxChange(
  checkbox: HTMLInputElement | null,
  onChange: (checked: boolean) => void,
) {
  checkbox?.addEventListener('change', () => {
    onChange(checkbox.checked)
  })
}
