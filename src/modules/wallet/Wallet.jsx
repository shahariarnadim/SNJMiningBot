import React, { useState } from "react";

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const snjBalance = 0;
  const nTokenBalance = 0;
  const dollarBalance = 0;
  const minimumWithdrawal = 0.01;

  const handleSaveWallet = () => {
    if (!walletAddress.trim()) {
      return;
    }

    // Wallet validation and saving
    // will be handled securely by the backend.
    console.log("Wallet address submitted");
  };

  const handleWithdraw = () => {
    // Withdrawal validation, balance check,
    // transaction creation and processing
    // will be handled by the backend.
    console.log("Withdrawal requested");
  };

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            Wallet
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your balances and withdrawals
          </p>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-[10px] text-gray-500">
              SNJ Balance
            </p>

            <p className="mt-1 text-lg font-black text-yellow-400">
              {snjBalance}
            </p>

            <p className="text-[10px] text-gray-600">
              Withdrawal Coming Soon
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-[10px] text-gray-500">
              Dollar Balance
            </p>

            <p className="mt-1 text-lg font-black text-green-400">
              ${dollarBalance.toFixed(4)}
            </p>

            <p className="text-[10px] text-gray-600">
              Min: ${minimumWithdrawal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* N Token */}
        <div className="mt-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-[10px] text-gray-500">
            N Token Balance
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {nTokenBalance}
          </p>

          <p className="mt-1 text-[10px] text-gray-600">
            Use Swap to convert N Token to Dollar.
          </p>
        </div>

        {/* TON Wallet */}
        <div className="mt-4 rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4">
          <h2 className="text-sm font-bold text-white">
            TON Wallet
          </h2>

          <p className="mt-1 text-[11px] text-gray-500">
            Add your TON wallet address for Dollar withdrawals.
          </p>

          <input
            type="text"
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
            placeholder="TON wallet address"
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-yellow-400/30"
          />

          <button
            type="button"
            onClick={handleSaveWallet}
            disabled={!walletAddress.trim()}
            className="mt-3 w-full rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-xs font-bold text-yellow-400 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save TON Wallet
          </button>
        </div>

        {/* Withdrawal */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">
                Dollar Withdrawal
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                Minimum ${minimumWithdrawal.toFixed(2)}
              </p>
            </div>

            <span className="rounded-lg bg-green-400/10 px-2 py-1 text-[10px] font-bold text-green-400">
              Available
            </span>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={
              dollarBalance < minimumWithdrawal ||
              !walletAddress.trim()
            }
            className="mt-4 w-full rounded-xl bg-green-400 px-4 py-3 text-xs font-black text-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Withdraw Dollar
          </button>
        </div>

        {/* Future Wallets */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-xs font-bold text-gray-400">
            Other Wallets
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Binance", "Bitget", "OKX", "Bybit"].map((wallet) => (
              <div
                key={wallet}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 text-center text-[10px] font-semibold text-gray-600"
              >
                {wallet}
                <div className="mt-1 text-[9px]">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
          <p className="text-[11px] leading-5 text-gray-500">
            Never enter your seed phrase, recovery phrase,
            private key or wallet password here.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Wallet;
