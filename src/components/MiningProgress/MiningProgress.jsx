import React from "react";

const MiningProgress = ({
  progress = 0,
  duration = "4 Hours",
}) => {
  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  return (
    <section className="mx-auto w-full max-w-md px-4 py-2">
      <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Mining Progress
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {duration}
            </p>
          </div>

          <span className="text-sm font-bold text-yellow-400">
            {safeProgress.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 transition-all duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-gray-600">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </section>
  );
};

export default MiningProgress;
