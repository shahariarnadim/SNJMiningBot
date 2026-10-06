import React from "react";

const Header = ({
  title = "SNJ Mining",
  subtitle = "Welcome back",
  notificationCount = 0,
  onNotificationClick,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-yellow-500/10 bg-[#05070d]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-wide text-yellow-400">
            {title}
          </h1>

          <p className="truncate text-xs text-gray-500">
            {subtitle}
          </p>
        </div>

        {/* Notification */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/10 bg-white/5 text-lg transition active:scale-95"
          aria-label="Notifications"
        >
          🔔

          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-black">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
