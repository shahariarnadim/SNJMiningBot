src/componentsimport React from "react";

const Background = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[100px]" />

        <div className="absolute bottom-[-180px] right-[-100px] h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="absolute left-[-120px] top-1/2 h-[260px] w-[260px] rounded-full bg-yellow-400/5 blur-[100px]" />
      </div>

      {/* App Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Background;/Background/Background.jsx
