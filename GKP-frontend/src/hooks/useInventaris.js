import { useContext } from 'react'
import { InventarisContext } from '../context/inventarisContextObject'

export function useInventaris() {
  const context = useContext(InventarisContext)
  if (!context) {
    throw new Error('useInventaris harus digunakan di dalam InventarisProvider')
  }
  return context
}
