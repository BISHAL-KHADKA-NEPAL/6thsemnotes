'use client';

import React, { useState } from "react";
import { Subject } from "../types";
import { SponsorSidebar } from "./SponsorSidebar";
import { useRouter } from "next/navigation";

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { title, iconName, colorTheme } = subject;
  const [showSponsor, setShowSponsor] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSponsor(true);

    // Navigate after a short delay
    setTimeout(() => {
      router.push(`/subjects/${subject.id}`);
    }, 1500);
  };

  return (
    <>
      <a
        className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
        href={`/subjects/${subject.id}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center size-12 rounded-full ${colorTheme.bg} ${colorTheme.darkBg} ${colorTheme.text} ${colorTheme.darkText}`}
          >
            <span className="material-symbols-outlined text-3xl">{iconName}</span>
          </div>
          <h3 className="text-slate-800 dark:text-slate-200 text-lg font-bold leading-tight flex-1">
            {title}
          </h3>
        </div>
      </a>

      <SponsorSidebar
        isOpen={showSponsor}
        onClose={() => setShowSponsor(false)}
      />
    </>
  );
};