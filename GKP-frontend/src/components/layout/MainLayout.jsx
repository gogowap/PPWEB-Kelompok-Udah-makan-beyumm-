import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { LoadingSkeleton, ErrorState } from '../common'
import { useInventaris } from '../../hooks/useInventaris'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoading, apiError, reloadData } = useInventaris()

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#5B528D] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main id="main-content" tabIndex={-1} className="p-4 sm:p-6 focus:outline-none">
          {isLoading ? (
            <LoadingSkeleton />
          ) : apiError ? (
            <ErrorState
              message={apiError}
              onRetry={() => reloadData({ simulateError: false })}
            />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
