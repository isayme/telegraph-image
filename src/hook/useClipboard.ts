import copy from 'copy-to-clipboard'
import { useEffect, useState } from 'react'

interface IOptions {
  /**
   * Reset the status after a certain number of milliseconds. This is useful
   * for showing a temporary success message.
   */
  successDuration?: number
}

export default function useClipboard(
  text: string | (() => string),
  options?: IOptions,
): [boolean, () => void] {
  const [isCopied, setIsCopied] = useState(false)
  const successDuration = options && options.successDuration

  useEffect(() => {
    if (isCopied && successDuration) {
      const id = setTimeout(() => {
        setIsCopied(false)
      }, successDuration)

      return () => {
        clearTimeout(id)
      }
    }
  }, [isCopied, successDuration])

  return [
    isCopied,
    () => {
      let s: string
      if (typeof text === 'function') {
        s = text()
      } else {
        s = text
      }
      const didCopy = copy(s)
      setIsCopied(didCopy)
    },
  ]
}
