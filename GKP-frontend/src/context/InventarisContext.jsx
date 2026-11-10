import { useCallback, useEffect, useState } from 'react'
import {
  InventarisContext,
  DEFAULT_INVENTARIS_SETTINGS,
} from './inventarisContextObject'
import {
  fetchBarangList,
  fetchDefaultSettings,
} from '../services/barangService'
import { fetchRiwayatList } from '../services/riwayatService'

function loadSavedSettings() {
  try {
    const saved = localStorage.getItem('inventaris_settings')
    if (!saved) return null
    return {
      ...DEFAULT_INVENTARIS_SETTINGS,
      ...JSON.parse(saved),
    }
  } catch {
    return null
  }
}

async function fetchInitialPayload({ simulateError = false } = {}) {
  const [barangData, riwayatData, defaultSettings] = await Promise.all([
    fetchBarangList({ simulateError }),
    fetchRiwayatList({ simulateError }),
    fetchDefaultSettings().catch(() => DEFAULT_INVENTARIS_SETTINGS),
  ])

  return { barangData, riwayatData, defaultSettings }
}

export default function InventarisProvider({ children }) {
  const [barang, setBarang] = useState([])
  const [riwayat, setRiwayat] = useState([])
  const [settings, setSettings] = useState(
    () => loadSavedSettings() || DEFAULT_INVENTARIS_SETTINGS
  )
  const [currentUser, setCurrentUser] = useState({
    nama: 'User',
    username: 'user',
    role: 'Role User',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  const reloadData = useCallback(async ({ simulateError = false } = {}) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const { barangData, riwayatData, defaultSettings } =
        await fetchInitialPayload({ simulateError })

      setBarang(barangData)
      setRiwayat(riwayatData)

      const saved = loadSavedSettings()
      if (!saved && defaultSettings) {
        setSettings({
          ...DEFAULT_INVENTARIS_SETTINGS,
          ...defaultSettings,
        })
      }
    } catch (err) {
      setApiError(
        err?.message || 'Gagal memuat data inventaris dari server API.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    fetchInitialPayload({ simulateError: false })
      .then(({ barangData, riwayatData, defaultSettings }) => {
        if (!active) return
        setBarang(barangData)
        setRiwayat(riwayatData)

        const saved = loadSavedSettings()
        if (!saved && defaultSettings) {
          setSettings({
            ...DEFAULT_INVENTARIS_SETTINGS,
            ...defaultSettings,
          })
        }
      })
      .catch((err) => {
        if (!active) return
        setApiError(
          err?.message || 'Gagal memuat data inventaris dari server API.'
        )
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const saveSettings = useCallback((nextSettings) => {
    const merged = {
      ...DEFAULT_INVENTARIS_SETTINGS,
      ...nextSettings,
    }
    setSettings(merged)
    try {
      localStorage.setItem('inventaris_settings', JSON.stringify(merged))
    } catch {
      return
    }
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_INVENTARIS_SETTINGS)
    try {
      localStorage.setItem(
        'inventaris_settings',
        JSON.stringify(DEFAULT_INVENTARIS_SETTINGS)
      )
    } catch {
      return
    }
  }, [])

  const value = {
    barang,
    setBarang,
    riwayat,
    setRiwayat,
    settings,
    setSettings,
    saveSettings,
    resetSettings,
    currentUser,
    setCurrentUser,
    isLoading,
    apiError,
    reloadData,
  }

  return (
    <InventarisContext.Provider value={value}>
      {children}
    </InventarisContext.Provider>
  )
}
