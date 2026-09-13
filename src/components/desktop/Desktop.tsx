import { APP_CATALOG, GROUP_LABELS, isOwnedByDepartment, type AppGroup, type Department } from "@/types/app";
import { AppIcon } from "./AppIcon";

interface DesktopProps {
  companyName: string;
  balance: number;
  department: Department;
  pseudonym: string;
  inboxCount?: number;
}

const GROUP_ORDER: AppGroup[] = ["BASIS", "EINKAUF", "VERKAUF", "LAGER", "BUCHHALTUNG"];

const DEPARTMENT_LABELS: Record<Department, string> = {
  EINKAUF: "Einkauf",
  VERKAUF: "Verkauf",
  BUCHHALTUNG: "Buchhaltung",
};

export function Desktop({ companyName, balance, department, pseudonym, inboxCount = 0 }: DesktopProps) {
  const initials = pseudonym.slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl bg-gray-100 p-3">
      <div className="rounded-xl bg-white p-5">
        <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <p className="text-[15px] font-medium text-gray-900">{companyName}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Firmenkonto:{" "}
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(balance)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent-50 px-2.5 py-1 text-xs text-accent-600">
              {DEPARTMENT_LABELS[department]}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-medium text-brand-800">
              {initials}
            </div>
          </div>
        </div>

        {GROUP_ORDER.map((group) => {
          const appsInGroup = APP_CATALOG.filter((app) => app.group === group);
          if (appsInGroup.length === 0) return null;

          return (
            <div key={group} className="mb-5 last:mb-0">
              <p className="mb-2 text-xs text-gray-500">{GROUP_LABELS[group]}</p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {appsInGroup.map((app) => (
                  <AppIcon
                    key={app.key}
                    app={app}
                    owned={isOwnedByDepartment(app, department)}
                    badgeCount={app.key === "posteingang" ? inboxCount : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
