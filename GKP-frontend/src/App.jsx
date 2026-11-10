import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InventarisProvider from './context/InventarisContext'
import { useInventaris } from './hooks/useInventaris'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BarangPage from './pages/BarangPage'
import BarangMasukPage from './pages/BarangMasukPage'
import PergerakanPage from './pages/PergerakanPage'
import StokPage from './pages/StokPage'
import StockOpnamePage from './pages/StockOpnamePage'
import RiwayatPage from './pages/RiwayatPage'
import SettingsPage from './pages/SettingsPage'

function AppRoutes() {
  const { barang, setBarang, riwayat, setRiwayat } = useInventaris()

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={<DashboardPage barang={barang} riwayat={riwayat} />}
        />
        <Route
          path="/barang"
          element={
            <BarangPage
              barang={barang}
              setBarang={setBarang}
              setRiwayat={setRiwayat}
            />
          }
        />
        <Route
          path="/barang-masuk"
          element={
            <BarangMasukPage
              barang={barang}
              setBarang={setBarang}
              setRiwayat={setRiwayat}
            />
          }
        />
        <Route
          path="/pergerakan"
          element={
            <PergerakanPage
              barang={barang}
              setBarang={setBarang}
              setRiwayat={setRiwayat}
            />
          }
        />
        <Route
          path="/stok"
          element={
            <StokPage
              barang={barang}
              setBarang={setBarang}
              setRiwayat={setRiwayat}
            />
          }
        />
        <Route
          path="/stock-opname"
          element={
            <StockOpnamePage
              barang={barang}
              setBarang={setBarang}
              setRiwayat={setRiwayat}
            />
          }
        />
        <Route path="/riwayat" element={<RiwayatPage riwayat={riwayat} />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <InventarisProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </InventarisProvider>
  )
}

export default App
