import { message } from 'antd'
import { useEffect, useRef } from 'react'

export function useErrorNotification(
  isError: boolean,
  text: string,
  key?: string,
) {
  const hasShownRef = useRef(false)

  useEffect(() => {
    if (isError && !hasShownRef.current) {
      if (key) {
        message.error({ content: text, key })
      } else {
        message.error(text)
      }
      hasShownRef.current = true
      return
    }

    if (!isError) {
      hasShownRef.current = false
    }
  }, [isError, key, text])
}

