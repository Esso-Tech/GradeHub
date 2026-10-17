import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { CONTACT_VIDE, SERVICES_DEFAUT } from '@/config/site'
import { getSite } from '@/features/site/site.api'

export const SiteContext = createContext(null)

/** Contenu des pages Services et Contact, chargé depuis l'API (contenu de secours si elle est injoignable). */
export function SiteProvider({ children }) {
  const [site, setSite] = useState({ contact: CONTACT_VIDE, services: SERVICES_DEFAUT })

  const reload = useCallback(async () => {
    try {
      const d = await getSite()
      setSite({
        contact: { ...CONTACT_VIDE, ...d.contact },
        services: d.services ?? SERVICES_DEFAUT,
      })
    } catch {
      /* on garde le contenu de secours */
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const value = useMemo(() => ({ ...site, reload }), [site, reload])
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
