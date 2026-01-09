import { useEffect, useState } from 'react'
import { FaBars, FaGaugeHigh, FaUsers, FaFolderOpen, FaGear, FaPlus, FaMinus, FaMusic } from 'react-icons/fa6'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5001/api/v1'

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: FaGaugeHigh },
  { id: 'users', label: 'Users', icon: FaUsers },
  {
    id: 'content',
    label: 'Content',
    icon: FaFolderOpen,
    children: [
      { id: 'content:songs', label: 'Songs' },
      { id: 'content:composers', label: 'Composers' },
      { id: 'content:melodies', label: 'Melodies' },
      { id: 'content:collections', label: 'Collections' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: FaGear },
]

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [contentExpanded, setContentExpanded] = useState(true)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState(null)

  useEffect(() => {
    if (activeItem === 'dashboard') {
      setLoadingStats(true)
      setStatsError(null)
      fetch(`${API_BASE}/stats`, { credentials: 'include' })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load stats: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          setStats(data)
          setLoadingStats(false)
        })
        .catch((error) => {
          setStats(null)
          setStatsError(error.message)
          setLoadingStats(false)
        })
    }
  }, [activeItem])

  const handleItemClick = (id) => {
    setActiveItem(id)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const renderSidebarItem = (item) => {
    const Icon = item.icon
    const isActive =
      activeItem === item.id ||
      (item.id === 'content' && activeItem.startsWith('content:'))
    const baseClasses =
      'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100'
    const activeClasses = isActive ? 'font-semibold text-blue-600 bg-blue-50' : 'text-black'
    const labelHidden = sidebarCollapsed && item.id !== 'content'

    if (item.id === 'content') {
      return (
        <div key={item.id} className="mt-4">
          <button
            type="button"
            className={`${baseClasses} w-full justify-between ${activeClasses}`}
            onClick={() => setContentExpanded((open) => !open)}
          >
            <div className="flex items-center gap-3">
              <Icon className="text-lg" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
            {!sidebarCollapsed && (
              <span className="text-xs">
                {contentExpanded ? <FaMinus /> : <FaPlus />}
              </span>
            )}
          </button>
          {contentExpanded && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => {
                const childActive = activeItem === child.id
                const childClasses = childActive
                  ? 'font-semibold text-blue-600 bg-blue-50'
                  : 'text-black'
                return (
                  <button
                    key={child.id}
                    type="button"
                    className={`flex items-center gap-2 px-6 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 w-full text-left ${childClasses}`}
                    onClick={() => handleItemClick(child.id)}
                  >
                    <FaMusic className="text-xs" />
                    {!sidebarCollapsed && <span className="text-sm">{child.label}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={item.id}
        type="button"
        className={`${baseClasses} ${activeClasses}`}
        onClick={() => handleItemClick(item.id)}
      >
        <Icon className="text-lg" />
        {!labelHidden && <span>{item.label}</span>}
      </button>
    )
  }

  const renderDashboard = () => {
    if (loadingStats) {
      return <p className="text-sm text-gray-600">Loading stats...</p>
    }
    if (statsError) {
      return <p className="text-sm text-red-500">Error loading stats: {statsError}</p>
    }
    if (!stats) {
      return <p className="text-sm text-gray-600">No statistics available yet.</p>
    }
    const entries = Object.entries(stats)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">
          High level overview of your application data.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">{value}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (activeItem === 'dashboard') {
      return renderDashboard()
    }
    if (activeItem === 'users') {
      return <h1 className="text-xl font-bold">Users</h1>
    }
    if (activeItem === 'settings') {
      return <h1 className="text-xl font-bold">Settings</h1>
    }
    if (activeItem === 'content:songs') {
      return <h1 className="text-xl font-bold">Songs</h1>
    }
    if (activeItem === 'content:composers') {
      return <h1 className="text-xl font-bold">Composers</h1>
    }
    if (activeItem === 'content:melodies') {
      return <h1 className="text-xl font-bold">Melodies</h1>
    }
    if (activeItem === 'content:collections') {
      return <h1 className="text-xl font-bold">Collections</h1>
    }
    return null
  }

  return (
    <div className="Page AdminPage -mx-4 md:-mx-6 lg:-mx-8">
      <div className="flex h-[calc(100vh-4rem)]">
        <aside
          className={`
            AdminSidebar
            bg-white border-r
            flex flex-col
            ${sidebarCollapsed ? 'w-16' : 'w-56'}
            h-full
            fixed md:static
            z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            transition-transform
          `}
        >
          <div className="flex items-center justify-between px-3 py-3 border-b">
            <button
              type="button"
              className="md:hidden p-2 rounded hover:bg-gray-100"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <FaBars />
            </button>
            <button
              type="button"
              className="hidden md:flex p-2 rounded hover:bg-gray-100"
              aria-label="Collapse sidebar"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            >
              <FaBars />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map(renderSidebarItem)}
          </nav>
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <main className="AdminMain flex-1 h-full md:ml-0 ml-0 md:pl-4 overflow-y-auto px-4 md:px-6 lg:px-8">
          <div className="py-4">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

