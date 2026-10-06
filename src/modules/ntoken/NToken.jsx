import React from "react";

const NToken = () => {
  const balance = 0;
  const transactions = [];

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            N Token
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your separate N Token balance and history
          </p>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl border border-yellow-500/10 bg-gradient-to-br from-yellow-400/10 to-transparent p-5 backdrop-blur-xl">
          <p className="text-xs text-gray-500">
            Available N Token
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-black text-white">
              {balance.toLocaleString("en-US")}
            </span>

            <span className="mb-1 text-sm font-bold text-yellow-400">
              N
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-xs font-bold text-yellow-400"
          >
            Earn N Token
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-gray-400"
          >
            Swap to Dollar
          </button>
        </div>

        {/* Transaction History */}
        <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                N Token History
              </h2>

              <p className="mt-1 text-[10px] text-gray-600">
                Rewards and N Token transactions
              </p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-5 text-center">
              <div className="text-2xl">🪙</div>

              <p className="mt-2 text-xs font-semibold text-gray-500">
                No transactions yet
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {transaction.type}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-600">
                      {transaction.date}
                    </p>
                  </div>

                  <p className="text-xs font-bold text-yellow-400">
                    {transaction.amount} N
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-[11px] leading-5 text-gray-600">
            N Token balance, rewards and transactions will
            be controlled by the backend database.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NToken;
