export function useIsomorphicKeys() {
  const isMac = navigator.platform.includes('Mac')

  return {
    isMac,
    altKey: isMac ? 'Opt' : 'Alt',
    ctrlKey: isMac ? 'Cmd' : 'Ctrl',
  }
}
