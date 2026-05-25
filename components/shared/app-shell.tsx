import type { ReactNode } from "react";
import { ApiConfigButton } from "@/components/shared/api-config-button";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1380px] flex-col gap-10 px-5 py-5 md:px-8 lg:px-10">
      <header className="glass-card sticky top-4 z-20 flex items-center justify-between rounded-full px-4 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(17,17,17,0.18)]">
            P
          </div>
          <p className="text-[11px] uppercase tracking-[0.38em] text-stone-500">
            Pet Whisper
          </p>
        </div>
        <nav className="hidden items-center gap-6 rounded-full px-2 text-sm font-medium text-stone-500 md:flex">
          <a className="transition hover:text-stone-900" href="/">
            Home
          </a>
          <a className="transition hover:text-stone-900" href="/favorites">
            Favorites
          </a>
          <a className="transition hover:text-stone-900" href="/history">
            History
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ApiConfigButton />
          <button
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-stone-700 shadow-[0_10px_24px_rgba(87,63,43,0.12)] transition hover:-translate-y-0.5"
          >
            G
          </button>
        </div>
      </header>
      {children}
    </main>
  );
}
