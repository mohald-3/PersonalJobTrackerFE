import type { ApplicationStatus } from "../../../types/JobApplication";
import { ApplicationStatusLabels } from "../../../types/JobApplication";

const statusClasses: Record<ApplicationStatus, string> = {
  0: "border-slate-200 bg-slate-50 text-slate-700", // Planned
  1: "border-blue-200 bg-blue-50 text-blue-700", // Applied
  2: "border-amber-200 bg-amber-50 text-amber-700", // Interview
  3: "border-emerald-200 bg-emerald-50 text-emerald-700", // Offer
  4: "border-rose-200 bg-rose-50 text-rose-700", // Rejected
  5: "border-green-200 bg-green-50 text-green-700", // Hired
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";
  const color = statusClasses[status];

  return (
    <span className={`${base} ${color} ${className}`}>
      {ApplicationStatusLabels[status]}
    </span>
  );
}
