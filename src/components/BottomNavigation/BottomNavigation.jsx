import React from "react";

const navigationItems = [
  { id: "Mine", icon: "⛏️", label: "Mine" },
  { id: "Boost", icon: "⚡", label: "Boost" },
  { id: "Tasks", icon: "📋", label: "Tasks" },
  { id: "Friends", icon: "👥", label: "Friends" },
  { id: "Swap", icon: "🔄", label: "Swap" },
  { id: "Wallet", icon: "💰", label: "Wallet" },
];

const BottomNavigation = ({ activePage, onChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-500/10 bg-[#080b12]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-1 py-2">
        {navigationItems.map((item) => {
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${
                active
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-gray-500 active:bg-white/5"
              }`}
            >
              <span
                className={`text-lg leading-none ${
                  active ? "scale-110" : ""
                }`}
              >
                {item.icon}
              </span>

              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
