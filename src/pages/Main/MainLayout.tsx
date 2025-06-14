import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import IcScan from '@/assets/ic-wallet-scan.svg?react'
import IcSetting from '@/assets/ic-wallet-setting.svg?react'

import FooterTabs from './FooterTabs'
import { useCryptoSocket } from './useCryptoSocket'

// Main layout for the app, includes header, content, and footer
const MainLayout: React.FC = () => {
  useCryptoSocket()

  return (
    <div className="min-h-screen flex flex-1 flex-col bg-[#0a1e3d]">
      {/* Header with settings and scan icons */}
      <div className="p-4 flex justify-between items-center">
        <IcSetting className="w-8 h-8" />
        <IcScan className="w-8 h-8" />
      </div>

      {/* Main content area */}
      <Outlet />

      {/* Bottom navigation */}
      <FooterTabs />
    </div>
  )
}

export default memo(MainLayout)
