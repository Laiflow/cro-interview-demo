import React, { memo } from 'react'
import { useCurrencyStore } from '../../../stores/atom/currency'
import { WalletBalance } from '../../../types/wallet'
import CoinCodeToName from '@/components/organism/CoinCodeToName'
import PrettyAmountCoin from '@/components/organism/PrettyAmountCoin'
import PrettyPrice from '@/components/organism/PrettyPrice'
import { useShallow } from 'zustand/shallow'

interface TokenItemProps {
  token: WalletBalance
}

const TokenItem: React.FC<TokenItemProps> = ({ token }) => {
  const currencyInfo = useCurrencyStore(useShallow((state) => state.getCurrency(token.currency)))

  if (!currencyInfo) {
    return null // 如果没有找到币种信息，不显示
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl mb-2 bg-white hover:bg-gray-50">
      <div className="flex items-center">
        <div className="w-10 h-10 mr-4">
          <img
            src={currencyInfo.colorful_image_url}
            alt={currencyInfo.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">
            <CoinCodeToName coin={token.currency} />
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="font-medium text-gray-900">
          <PrettyAmountCoin code={token.currency} amount={token.amount} />
        </div>
        <div className="text-sm text-gray-500">
          $ <PrettyPrice>{token.amount}</PrettyPrice>
        </div>
      </div>
    </div>
  )
}

export default memo(TokenItem)
