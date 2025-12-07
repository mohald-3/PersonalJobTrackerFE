import { Link } from "react-router-dom";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { ApplicationStatus } from "../../../types/JobApplication";
import { StatusBadge } from "../../jobApplications/components/StatusBadge";
import { useDelayedLoading } from "../../../hooks/useDelayedLoading";

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardOverview();

  const showSkeleton = useDelayedLoading(isLoading, 500); // 500ms minimum

  if (showSkeleton) {
    return <DashboardSkeleton />;
  }

  if (isError || !data?.isSuccess || !data.data) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-semibold">Failed to load dashboard.</p>
        {error && <p className="mt-1">{error.message}</p>}
        {data?.errors?.length ? (
          <ul className="mt-2 list-disc pl-5">
            {data.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  const overview = data.data;

  const statusMap = new Map<ApplicationStatus, number>();
  overview.applicationsByStatus.forEach((s) => {
    statusMap.set(s.status, s.count);
  });

  const statusOrder: ApplicationStatus[] = [0, 1, 2, 3, 4, 5];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard overview
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            High-level view of your companies and job applications.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/applications/create"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New application
          </Link>
          <Link
            to="/companies/create"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + New company
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Total companies"
          value={overview.totalCompanies.toString()}
        />
        <SummaryCard
          label="Total applications"
          value={overview.totalApplications.toString()}
        />
        <SummaryCard
          label="Avg applications per company"
          value={
            overview.totalCompanies > 0
              ? (overview.totalApplications / overview.totalCompanies)
                  .toFixed(1)
                  .toString()
              : "0.0"
          }
        />
      </div>

      {/* Status distribution + top companies */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications by status */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Applications by status
            </h2>
          </div>
          <div className="space-y-2">
            {statusOrder.map((status) => {
              const count = statusMap.get(status) ?? 0;
              return (
                <div
                  key={status}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="font-mono">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top companies by applications */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Top companies by applications
            </h2>
          </div>

          {overview.topCompaniesByApplications.length === 0 ? (
            <p className="text-sm text-slate-500">
              No applications yet. Start by creating a company and a job
              application.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {overview.topCompaniesByApplications.map((c) => (
                <li
                  key={c.companyId}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <div className="flex flex-col">
                    <Link
                      to={`/companies/${c.companyId}`}
                      className="font-medium text-slate-900 hover:text-blue-700 hover:underline"
                    >
                      {c.companyName}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {c.applicationsCount} application
                      {c.applicationsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {c.applicationsCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent applications */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Recent applications
          </h2>
          <Link
            to="/applications"
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            View all
          </Link>
        </div>

        {overview.recentApplications.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent applications. Create your first one to see it here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Position</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Applied</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 align-top">
                      <Link
                        to={`/applications/${app.id}`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        {app.positionTitle}
                      </Link>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {app.companyId ? (
                        <Link
                          to={`/companies/${app.companyId}`}
                          className="text-sm text-slate-800 hover:text-blue-700 hover:underline"
                        >
                          {app.companyName}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-700">
                          {app.companyName}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className="text-xs text-slate-600">
                        {formatDate(app.appliedDate)}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top text-right">
                      <Link
                        to={`/applications/${app.id}/edit`}
                        className="text-xs font-medium text-slate-600 hover:text-blue-700 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

/* -------------------------
   Skeleton components
-------------------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Status + top companies skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5"
              >
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 py-2"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent applications table skeleton */}
      <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="mt-2 space-y-2">
          {/* header */}
          <Skeleton className="h-4 w-full" />
          {/* rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-10 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-16" />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`rounded-md bg-slate-200/80 ${className}`} />;
}
