import React from "react";

const Notification = ({
  notifications = [],
  onClose,
  onMarkAsRead,
}) => {
  const items = Array.isArray(notifications)
    ? notifications
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 px-3 pb-20 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-yellow-500/10 bg-[#080b12] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Notifications
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              Your latest updates
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition active:scale-95"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-black/20 px-4 py-8 text-center">
              <div className="text-3xl">🔔</div>

              <p className="mt-3 text-sm font-semibold text-gray-400">
                No notifications
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    onMarkAsRead?.(notification.id)
                  }
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    notification.read
                      ? "border-white/5 bg-white/[0.02]"
                      : "border-yellow-500/10 bg-yellow-400/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-400/10">
                      {notification.icon || "🔔"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-white">
                          {notification.title ||
                            "Notification"}
                        </p>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                        )}
                      </div>

                      <p className="mt-1 text-[11px] leading-5 text-gray-500">
                        {notification.message || ""}
                      </p>

                      <p className="mt-2 text-[9px] text-gray-700">
                        {notification.date || ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
