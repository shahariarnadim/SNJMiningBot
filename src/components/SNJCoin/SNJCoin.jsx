import React from "react";

const SNJCoin = ({ size = 180, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{
          filter: "drop-shadow(0 0 22px rgba(250, 204, 21, 0.35))",
        }}
      >
        {/* Glow */}
        <div className="absolute inset-[-10%] rounded-full bg-yellow-400/10 blur-2xl" />

        {/* Fixed Coin */}
        <div
          className="relative flex h-[88%] w-[88%] items-center justify-center rounded-full border-4 border-yellow-300/80 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 shadow-[inset_0_0_20px_rgba(255,255,255,0.35),0_0_25px_rgba(234,179,8,0.45)]"
        >
          {/* Inner Ring */}
          <div className="absolute inset-[8%] rounded-full border-2 border-yellow-100/50" />

          {/* SNJ Text */}
          <span className="relative z-10 select-none text-4xl font-black tracking-wider text-yellow-950 drop-shadow-[0_2px_2px_rgba(255,255,255,0.35)]">
            SNJ
          </span>
        </div>
      </div>
    </div>
  );
};

export default SNJCoin;
