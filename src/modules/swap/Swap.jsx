import React, { useState } from "react";

const Swap = () => {
  const [amount, setAmount] = useState("");

  const exchangeRate = null;

  const estimatedDollar =
    exchangeRate && Number(amount) > 0
      ? Number(amount) * exchangeRate
      : 0;

  const handleSwap = () => {
    // Real swap validation and transaction
    // will be handled by the backend.
    console.log("Swap requested:", amount);
  };

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            Swap
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Convert N Token to Dollar
          </p>
        </div>

        {/* Swap Card */}
        <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          {/* From */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                From
              </span>

              <span className="text-xs font-bold text-gray-300">
                N TOKEN
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-400/10 text-yellow-400">
              ↓
            </div>
          </div>

          {/* To */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                To
              </span>

              <span className="text-xs font-bold text-gray-300">
                DOLLAR
              </span>
            </div>

            <p className="mt-3 text-2xl font-black text-green-400">
              ${estimatedDollar.toFixed(4)}
            </p>
          </div>

          {/* Rate */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Exchange Rate
            </span>

            <span className="font-semibold text-gray-400">
              {exchangeRate
                ? `1 N = $${exchangeRate}`
                : "Coming Soon"}
            </span>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            disabled={!amount || Number(amount) <= 0}
            className="mt-5 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Swap N Token
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-[11px] leading-5 text-gray-600">
            Swap rate, balance validation and transaction
            processing will be controlled by the backend.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Swap;
