import React from "react";

const BalanceCard = ({
  snjBalance = 0,
  nTokenBalance = 0,
  dollarBalance = 0,
}) => {
  const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      maximumFractionDigits: 4,
    });
  };

  return (
    <section className="mx-auto w-full max-w-md px-4 py-3">
      <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        {/* Main SNJ Balance */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500">
            SNJ Balance
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-black tracking-tight text-white">
              {formatNumber(snjBalance)}
            </span>

            <span className="mb-1 text-sm font-semibold text-yellow-400">
              SNJ
            </span>
          </div>
        </div>

        {/* Other Balances */}
        <div className="grid grid-cols-2 gap-3">
          {/* N Token */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="text-[11px] text-gray-500">
              N Token
            </p>

            <p className="mt-1 truncate text-base font-bold text-white">
              {formatNumber(nTokenBalance)}
            </p>
          </div>

          {/* Dollar */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="text-[11px] text-gray-500">
              Dollar
            </p>

            <p className="mt-1 truncate text-base font-bold text-green-400">
              ${formatNumber(dollarBalance)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BalanceCard;
