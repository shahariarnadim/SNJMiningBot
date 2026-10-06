import React from "react";

const Tasks = () => {
  const tasks = [];

  return (
    <main className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-white">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete tasks and earn rewards
          </p>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl">
            <div className="text-4xl">📋</div>

            <h2 className="mt-3 text-base font-bold text-white">
              No Tasks Available
            </h2>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              New tasks will appear here when they are
              added by the admin.
            </p>
          </div>
        )}

        {/* Future Task List */}
        {tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {task.title}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {task.description}
                    </p>
                  </div>

                  <span className="whitespace-nowrap rounded-lg bg-yellow-400/10 px-2 py-1 text-xs font-bold text-yellow-400">
                    +{task.reward ?? 0} SNJ
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-yellow-400 px-4 py-3 text-xs font-black text-black transition active:scale-[0.98]"
                >
                  Complete Task
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-[11px] leading-5 text-gray-600">
            Task rewards will only be credited after
            server-side verification.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Tasks;
