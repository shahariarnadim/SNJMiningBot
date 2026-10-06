import React, { useState } from "react";

const Friends = () => {
  const [copied, setCopied] = useState(false);

  const referralLink = "Coming Soon";

  const handleCopy = async () => {
    if (referralLink === "Coming Soon") {
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            Friends
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Invite friends and earn rewards
          </p>
        </div>

        {/* Referral Card */}
        <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-4xl">👥</div>

            <h2 className="mt-3 text-lg font-bold text-white">
              Invite Friends
            </h2>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Share your referral link and receive rewards
              for eligible successful referrals.
            </p>
          </div>

          {/* Referral Link */}
          <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="mb-2 text-[10px] text-gray-600">
              Your Referral Link
            </p>

            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1 truncate text-xs text-gray-400">
                {referralLink}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                disabled={referralLink === "Coming Soon"}
                className="rounded-lg bg-yellow-400 px-3 py-2 text-[10px] font-black text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
              <p className="text-[10px] text-gray-600">
                Successful Referrals
              </p>

              <p className="mt-1 text-xl font-black text-white">
                0
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
              <p className="text-[10px] text-gray-600">
                Referral Rewards
              </p>

              <p className="mt-1 text-xl font-black text-yellow-400">
                0
              </p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-[11px] leading-5 text-gray-600">
            Referral eligibility and rewards will be
            verified by the backend before any reward is
            credited.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Friends;
