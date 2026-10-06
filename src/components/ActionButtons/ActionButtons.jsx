import React from "react";

const ActionButtons = ({
  miningActive = false,
  canClaim = false,
  onStartMining,
  onClaim,
  onWatchAd,
}) => {
  return (
    <section className="mx-auto w-full max-w-md px-4 py-3">
      <div className="grid gap-3">
        {/* Start Mining */}
        {!miningActive && (
          <button
            type="button"
            onClick={onStartMining}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 px-5 py-4 text-sm font-black text-black shadow-[0_8px_25px_rgba(234,179,8,0.25)] transition active:scale-[0.98]"
          >
            ⛏️ Start Mining
          </button>
        )}

        {/* Claim */}
        {canClaim && (
          <button
            type="button"
            onClick={onClaim}
            className="w-full rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-4 text-sm font-bold text-yellow-300 transition active:scale-[0.98]"
          >
            💰 Claim SNJ
          </button>
        )}

        {/* Watch Ad */}
        <button
          type="button"
          onClick={onWatchAd}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          🎬 Watch Ad 2x
        </button>
      </div>
    </section>
  );
};

export default ActionButtons;
