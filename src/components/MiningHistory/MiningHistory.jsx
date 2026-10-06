import React from "react";

const MiningHistory = ({ history = [], onViewAll }) => {
  const items = Array.isArray(history) ? history : [];

  return (
    <section className="mx-auto w-full max-w-md px-4 py-2 pb-24">
      <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">
              Mining History
            </p>

            <p className="mt-1 text-[11px] text-gray-500">
              Recent mining activity
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-yellow-400"
            >
              View All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-5 text-center">
            <div className="text-2xl">⛏️</div>

            <p className="mt-2 text-sm font-medium text-gray-400">
              No mining history yet
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              Your completed mining sessions will appear here.
            </p>
          </div>
        )}

        {/* History List */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.slice(0, 5).map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">
                    {item.status || "Mining Session"}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500">
                    {item.date || "Date unavailable"}
                  </p>
                </div>

                <div className="ml-3 text-right">
                  <p className="text-xs font-bold text-yellow-400">
                    +{item.reward ?? 0} SNJ
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    {item.duration || "4 Hours"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MiningHistory;
