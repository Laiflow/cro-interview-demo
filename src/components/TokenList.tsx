import React from "react";
import TokenItem from "./TokenItem";
import { WalletBalance } from "../store/walletStore";

interface TokenListProps {
  tokens: WalletBalance[];
}

const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No tokens found in your wallet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {tokens.map((token) => (
        <TokenItem key={token.currency} token={token} />
      ))}
    </div>
  );
};

export default TokenList;
