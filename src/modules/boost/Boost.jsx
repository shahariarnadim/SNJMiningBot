import React from "react";

const Boost = () => {
  const boosts = [
    {
      id: "speed",
      name: "Mining Speed",
      description: "Increase your mining speed",
      multiplier: "2x",
      duration: "1 Hour",
      cost: "Coming Soon",
    },
    {
      id: "power",
      name: "Mining Power",
      description: "Increase your mining power",
      multiplier: "5x",
      duration: "4 Hours",
      cost: "Coming Soon",
    },
  ];

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            Boost
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Increase your mining power
          </p>
        </div>

        {/* Boost List */}
        <div className="space-y-3">
          {boosts.map((boost) => (
            <div
              key={boost.id}
              className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {boost.name}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {boost.description}
                  </p>
                </div>

                <span className="rounded-lg bg-yellow-400/10 px-2 py-1 text-xs font-bold text-yellow-400">
                  {boost.multiplier}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-600">
                    Duration
                  </p>

                  <p className="text-sm font-semibold text-gray-300">
                    {boost.duration}
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-500"
                >
                  {boost.cost}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-5 rounded-2xl border border-yellow-500/10 bg-yellow-400/5 p-4">
          <p className="text-xs leading-5 text-gray-400">
            Boost settings will be controlled by the admin
            system and backend in the production version.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Boost;
