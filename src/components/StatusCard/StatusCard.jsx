import React from "react";

const StatusCard = ({
  miningActive = false,
  miningRate = 0,
  remainingTime = "04:00:00",
}) => {
  return (
    <section className="mx-auto w-full max-w-md px-4 py-2">
      <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Mining Status */}
          <div>
            <p className="text-xs text-gray-500">
              Mining Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  miningActive
                    ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]"
                    : "bg-gray-500"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  miningActive
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {miningActive ? "Mining Active" : "Mining Inactive"}
              </span>
            </div>
          </div>

          {/* Mining Rate */}
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Mining Rate
            </p>

            <p className="mt-1 text-sm font-bold text-yellow-400">
              +{miningRate} SNJ/h
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-4 rounded-xl border border-yellow-500/10 bg-black/20 px-4 py-3 text-center">
          <p className="text-[11px] uppercase tracking-wider text-gray-500">
            Time Remaining
          </p>

          <p className="mt-1 font-mono text-2xl font-black tracking-widest text-white">
            {remainingTime}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatusCard;
