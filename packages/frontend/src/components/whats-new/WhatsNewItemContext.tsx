import { createContext, useContext } from 'react'

export interface WhatsNewItem {
  id: string
  title: string
  description: string | undefined
  href: string
  imageSrc: string
  imageAlt: string
}

const WhatsNewItemContext = createContext<WhatsNewItem | undefined>(undefined)

export function WhatsNewItemProvider({
  item,
  children,
}: {
  item: WhatsNewItem | undefined
  children: React.ReactNode
}) {
  return (
    <WhatsNewItemContext.Provider value={item}>
      {children}
    </WhatsNewItemContext.Provider>
  )
}

export function useWhatsNewItem() {
  return useContext(WhatsNewItemContext)
}
