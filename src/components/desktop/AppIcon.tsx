import Link from "next/link";
import type { AppDefinition } from "@/types/app";

interface AppIconProps {
  app: AppDefinition;
  owned: boolean;
  badgeCount?: number;
}

export function AppIcon({ app, owned, badgeCount }: AppIconProps) {
  const isBasisApp = app.group === "BASIS";

  return (
    <Link
      href={app.href}
      className={`relative flex flex-col items-center rounded-lg p-3 text-center transition-colors hover:bg-white/60 ${
        !isBasisApp && owned ? "border border-brand-400/60" : ""
      }`}
    >
      {badgeCount ? (
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
          {badgeCount}
        </span>
      ) : null}
      {!isBasisApp && !owned ? (
        <span className="absolute right-1.5 top-1.5 text-[9px] text-gray-400">Nur-Lese</span>
      ) : null}
      <i
        className={`ti ti-${app.iconName} text-[22px] ${
          !isBasisApp && owned ? "text-accent-400" : "text-gray-700"
        }`}
        aria-hidden="true"
      />
      <span className="mt-1.5 text-xs text-gray-800">{app.label}</span>
    </Link>
  );
}
