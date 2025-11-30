import React from "react";

export const Hero: React.FC = () => {
  return (
    <div className="@container mb-10">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHay8lQ6m9Wg1zb3uwY2ppwUFOn1dYz5-Cby_sfvyaOtENUu3IW5Y77BAwa_EzW_lrwPeB5hOfdOVxELorTGfr-he-0PbGn17uBV8LWSAtAlSmqJT-WZOGSxNWPWFgQY9F-lghzfVC9TVMk0vnPPWebUBZfN5LwsqFYee6-Mm_U9-x-DqOcV9fv_-WxnSQMayqRInNORQyTNLsfMeIS6xG83GuWFfrBxfX0gkCksbY3TWdAMFUXVWDsmTTCLycZxmNf54CqV4KQmw")',
          }}
        >
          <div className="flex flex-col gap-2 text-center max-w-2xl animate-fade-in-up">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] drop-shadow-sm">
              All Your BBA 6th Sem Notes in One Place
            </h1>
            <h2 className="text-slate-200 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal drop-shadow-sm">
              Access, view, and download notes for every subject instantly.
            </h2>
          </div>
          <a
            href="#subjects"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg"
          >
            <span className="truncate">View All Subjects</span>
          </a>
        </div>
      </div>
    </div >
  );
};