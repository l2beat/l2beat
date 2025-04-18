export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  waitFor: number,
) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(() => {
        resolve(callback(...args))
      }, waitFor)
    })
  }
}
