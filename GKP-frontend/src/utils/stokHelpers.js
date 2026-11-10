import { sisaHari } from './dateHelpers'

export const BATAS_KEDALUWARSA_HARI = 30

export function isStokKritis(item) {
  return item.stokGudang <= item.stokMinimum
}

export function isMendekatiKadaluarsa(item, today = new Date()) {
  const sisa = sisaHari(item.kadaluarsa, today)
  return sisa !== null && sisa <= BATAS_KEDALUWARSA_HARI
}

export function getStokStatus(item, today = new Date()) {
  if (isStokKritis(item)) return 'kritis'
  if (isMendekatiKadaluarsa(item, today)) return 'kadaluarsa'
  return 'aman'
}

export const STATUS_ROW_CLASS = {
  kritis: 'bg-rose-50/60',
  kadaluarsa: 'bg-amber-50/60',
  aman: '',
}
