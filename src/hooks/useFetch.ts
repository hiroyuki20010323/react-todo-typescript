import { useState, useEffect } from 'react'
import type { FetchStatus } from '../types/FetchStatus'

function useFetch<T>(url: string): FetchStatus<T> {
  const [status, setStatus] = useState<FetchStatus<T>>({ kind: 'loading' })

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setStatus({ kind: 'success', data: data as T }))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : '通信に失敗しました'
        setStatus({ kind: 'error', message })
      })
  }, [url])

  return status
}

export default useFetch
