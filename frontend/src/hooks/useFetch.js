import { useCallback, useEffect, useRef, useState } from 'react'
import { messageErreur } from '@/services/api'

/** Charge des données au montage et quand `deps` change. `reload()` relance l'appel. */
export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async (silencieux = false) => {
    if (!silencieux) setLoading(true)
    try {
      setData(await fnRef.current())
      setError('')
    } catch (err) {
      setError(messageErreur(err))
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run() }, deps)

  return { data, error, loading, reload: run }
}
