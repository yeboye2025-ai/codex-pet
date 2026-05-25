import type { ReactNode } from "react";

type FloatingCardProps = {
  children: ReactNode;
  className?: string;
};

export function FloatingCard({ children, className = "" }: FloatingCardProps) {
  return (
    <div
      className={`rounded-[32px] border border-white/70 bg-white/65 shadow-[0_30px_80px_rgba(120,92,52,0.12)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
