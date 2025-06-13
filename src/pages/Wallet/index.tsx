import React from 'react'
import { useWalletBalance } from '@/pages/Wallet/hooks/useWalletBalance'
import TokenList from './components/TokenList'
import BalanceHeader from './components/BalanceHeader'
import { useClick } from './hooks/useClick'

const WalletDashboard: React.FC = () => {
  const { totalBalance, walletBalances, isLoading, error, refetch } = useWalletBalance()

  const { handleSendClick, handleReceiveClick } = useClick()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-white">
        <p>Loading wallet data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-white">
        <p className="text-red-500 mb-4">Error: {(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 text-white">
      <BalanceHeader
        totalBalance={totalBalance}
        onSendClick={handleSendClick}
        onReceiveClick={handleReceiveClick}
      />

      {/* Token list */}
      <div className="flex-1 bg-[#f4fafe]  rounded-2xl overflow-hidden">
        <TokenList tokens={walletBalances} />
      </div>
    </div>
  )
}

export default WalletDashboard
