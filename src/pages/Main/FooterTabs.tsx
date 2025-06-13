import React, { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Footer navigation tabs for Wallet and DeFi pages
const FooterTabs: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // Check if a tab is active
  const isActive = (path: string) => {
    if (path === '/wallet') {
      return currentPath === '/wallet' || currentPath === '/'
    }
    return currentPath.includes(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around h-16">
      <Link
        to="/wallet"
        className={`flex flex-col items-center justify-center w-full h-full ${isActive('/wallet') ? 'text-blue-500' : 'text-gray-500'}`}
      >
        {/* Wallet Tab Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <span className="text-xs mt-1">Wallet</span>
      </Link>

      <Link
        to="/defi"
        className={`flex flex-col items-center justify-center w-full h-full ${isActive('/defi') ? 'text-blue-500' : 'text-gray-500'}`}
      >
        {/* DeFi Tab IC */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
        <span className="text-xs mt-1">DeFi</span>
      </Link>
    </div>
  )
}

export default memo(FooterTabs)
