export function copyStringToClipboard(str: string) {
  if (navigator.clipboard) {
    // Modern approach using Clipboard API
    navigator.clipboard.writeText(str).catch((err) => {
      console.error('Failed to copy text to clipboard:', err)
    })
  } else {
    // Fallback approach for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = str
    // Avoiding the textarea being visible to the user
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }

    document.body.removeChild(textarea)
  }
}
