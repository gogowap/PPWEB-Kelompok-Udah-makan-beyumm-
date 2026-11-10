import { createContext } from 'react'

export const DEFAULT_INVENTARIS_SETTINGS = {
  stokKritisGudang: 5,
  stokKritisDisplay: 3,
  kadaluarsaBulan: 3,
  kadaluarsaMendesakHari: 30,
}

export const InventarisContext = createContext(null)
