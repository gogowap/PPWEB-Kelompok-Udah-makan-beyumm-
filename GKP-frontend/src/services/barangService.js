import apiClient from './apiClient'
import {
  getKloterList,
  buatItemDenganKloter,
  kadaluarsaTerdekat,
} from '../utils/kloterHelpers'
import {
  sesuaikanTanggalBulanIni,
  tambahHariISO,
} from '../utils/dateHelpers'

export async function fetchBarangList({ simulateError = false } = {}) {
  if (simulateError) {
    throw new Error('Simulasi kegagalan koneksi ke server inventaris GKP.')
  }

  const response = await apiClient.get('/barang.json')
  const rawList = Array.isArray(response.data) ? response.data : []

  return rawList.map((item) => {
    const kloterList = getKloterList(item).map((k) => {
      let tanggalKadaluarsa = k.tanggalKadaluarsa
      if (k.tanggalKadaluarsa === '2026-11-28') {
        tanggalKadaluarsa = tambahHariISO(18)
      } else if (k.tanggalKadaluarsa === '2026-12-05') {
        tanggalKadaluarsa = tambahHariISO(25)
      } else if (k.tanggalKadaluarsa === '2027-01-12') {
        tanggalKadaluarsa = tambahHariISO(62)
      }

      return {
        ...k,
        tanggalMasuk: sesuaikanTanggalBulanIni(k.tanggalMasuk),
        tanggalKadaluarsa,
      }
    })

    const normalized = buatItemDenganKloter(item, kloterList)
    return {
      ...normalized,
      kadaluarsa: kadaluarsaTerdekat(kloterList),
    }
  })
}

export async function fetchDefaultSettings() {
  const response = await apiClient.get('/settings.json')
  return response.data
}

export function createBarang(data, existingList) {
  const nextId =
    existingList.reduce(
      (max, item) => Math.max(max, item.id),
      0
    ) + 1

  return {
    id: nextId,
    stokGudang: 0,
    stokDisplay: 0,
    kadaluarsa: '',
    kloter: [],
    ...data,
  }
}

export function updateBarang(list, id, data) {
  return list.map((item) =>
    item.id === id
      ? { ...item, ...data }
      : item
  )
}

export function deleteBarang(list, id) {
  return list.filter(
    (item) => item.id !== id
  )
}

export function tambahStokGudang(
  list,
  id,
  jumlah
) {
  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          stokGudang:
            Number(item.stokGudang ?? 0) +
            Number(jumlah ?? 0),
        }
      : item
  )
}

export function transferGudangKeDisplay(
  list,
  id,
  jumlah
) {
  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          stokGudang:
            Number(item.stokGudang ?? 0) -
            Number(jumlah ?? 0),
          stokDisplay:
            Number(item.stokDisplay ?? 0) +
            Number(jumlah ?? 0),
        }
      : item
  )
}

export function setStokGudangHasilOpname(
  list,
  id,
  stokFisik
) {
  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          stokGudang: Number(stokFisik ?? 0),
        }
      : item
  )
}

function ubahKloter(list, id, kloterId, fn) {
  return list.map((item) => {
    if (item.id !== id) return item
    const kloterBaru = getKloterList(item).map((k) =>
      String(k.id) === String(kloterId) ? fn(k) : k
    )
    return buatItemDenganKloter(item, kloterBaru)
  })
}

export function tambahKloterBarang(list, id, kloterBaru) {
  return list.map((item) => {
    if (item.id !== id) return item
    const kloterLama = getKloterList(item)
    return {
      ...buatItemDenganKloter(item, [...kloterLama, kloterBaru]),
      kadaluarsa: kloterBaru.tanggalKadaluarsa,
    }
  })
}

export function transferKloterGudangKeDisplay(list, id, kloterId, jumlah) {
  const n = Number(jumlah ?? 0)
  return ubahKloter(list, id, kloterId, (k) => ({
    ...k,
    stokGudang: k.stokGudang - n,
    stokDisplay: k.stokDisplay + n,
  }))
}

export function setStokKloter(list, id, kloterId, { stokGudang, stokDisplay }) {
  return ubahKloter(list, id, kloterId, (k) => ({
    ...k,
    stokGudang: Number(stokGudang),
    stokDisplay: Number(stokDisplay),
  }))
}

export function kurangiStokDisplayKloter(list, id, kloterId, jumlah) {
  const n = Number(jumlah ?? 0)
  return ubahKloter(list, id, kloterId, (k) => ({
    ...k,
    stokDisplay: k.stokDisplay - n,
  }))
}

export function setStokDisplayHasilOpname(list, id, kloterId, stokFisik) {
  return ubahKloter(list, id, kloterId, (k) => ({
    ...k,
    stokDisplay: Number(stokFisik ?? 0),
  }))
}

export function hapusKloterBarang(list, id, kloterId) {
  return list.map((item) => {
    if (item.id !== id) return item
    const sisa = getKloterList(item).filter(
      (k) => String(k.id) !== String(kloterId)
    )
    return {
      ...buatItemDenganKloter(item, sisa),
      kadaluarsa: kadaluarsaTerdekat(sisa),
    }
  })
}
