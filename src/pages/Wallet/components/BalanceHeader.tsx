import React from 'react'
import LeftArrow from '@/assets/ic-arrow-left.svg?react'
import RightArrow from '@/assets/ic-arrow-right.svg?react'
import IcLogo from '@/assets/ic-logo.svg?react'

interface BalanceHeaderProps {
  totalBalance: string
  onSendClick?: () => void
  onReceiveClick?: () => void
}

const BalanceHeader: React.FC<BalanceHeaderProps> = ({
  totalBalance,
  onSendClick,
  onReceiveClick,
}) => {
  return (
    <div className="p-4 mb-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <IcLogo className="w-10 h-10" />
          <span className="text-xl font-normal">crypto.com</span>
          <div className="w-[1px] h-4 bg-gray-400 mx-2"></div>
          <span className="text-xl text-gray-700 font-bold">DEFI WALLET</span>
        </div>

        <div className="flex items-center">
          <span className="text-2xl text-gray-600 mr-1 font-bold">$</span>
          <span className="text-4xl font-bold">{totalBalance}</span>
          <span className="text-2xl text-gray-600 ml-1 font-bold">USD</span>
        </div>
      </div>

      {/* Send and receive buttons */}
      <div className="flex justify-center space-x-16 mt-6 px-4">
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center"
            onClick={onSendClick}
          >
            <LeftArrow />
          </button>
          <span className="mt-2 text-white">Send</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center"
            onClick={onReceiveClick}
          >
            <RightArrow />
          </button>
          <span className="mt-2 text-white">Receive</span>
        </div>
      </div>
    </div>
  )
}

export default BalanceHeader
