import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ApplicationStatusLabels,
  type ApplicationStatus,
  type JobApplicationDto,
} from "../../../types/JobApplication";

import { useJobApplications } from "../hooks/useJobApplications";
import { useDeleteJobApplication } from "../hooks/useJobApplicationMutations";
import { StatusBadge } from "../components/StatusBadge";

const pageSizeDefault = 10;

// Status dropdown options (All + numeric enum)
const statusOptions: (ApplicationStatus | "All")[] = [
  "All",
  0, // Planned
  1, // Applied
  2, // Interview
  3, // Offer
  4, // Rejected
  5, // Hired
];

export default function JobApplicationsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState<ApplicationStatus | "All">(
    (searchParams.get("status") as ApplicationStatus | "All") ?? "All",
  );
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") ?? "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") ?? "");

  const pageNumber = Number(searchParams.get("pageNumber") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? pageSizeDefault);

  const { data, isLoading, isError } = useJobApplications({
    search: search || undefined,
    status: status === "All" ? undefined : status,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    companyId: searchParams.get("companyId") ?? undefined,
    pageNumber,
    pageSize,
  });

  const deleteMutation = useDeleteJobApplication();

  /* ------------------------------
      FILTER HANDLERS
  ------------------------------ */

  const applyFilters = () => {
    const next = new URLSearchParams();

    if (search.trim()) next.set("search", search.trim());
    if (status !== "All") next.set("status", String(status));
    if (fromDate) next.set("fromDate", fromDate);
    if (toDate) next.set("toDate", toDate);

    next.set("pageNumber", "1");
    next.set("pageSize", pageSize.toString());

    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setFromDate("");
    setToDate("");

    const next = new URLSearchParams();
    next.set("pageNumber", "1");
    next.set("pageSize", pageSize.toString());

    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("pageNumber", String(nextPage));
    setSearchParams(next);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?"))
      return;
    deleteMutation.mutate(id);
  };

  const pagedResult = data?.data;
  const items = pagedResult?.items ?? [];

  /* ------------------------------
      RENDER
  ------------------------------ */

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Job Applications</h1>

        <Link
          to="/applications/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Search</label>
            <input
              type="text"
              className="rounded-md border px-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Position, notes..."
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Status</label>
            <select
              className="rounded-md border px-3 py-2 text-sm"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value === "All"
                    ? "All"
                    : (Number(e.target.value) as ApplicationStatus),
                )
              }
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All" : ApplicationStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">From</label>
            <input
              type="date"
              className="rounded-md border px-3 py-2 text-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">To</label>
            <input
              type="date"
              className="rounded-md border px-3 py-2 text-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md border px-3 py-1.5 text-sm"
            onClick={clearFilters}
          >
            Clear
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading && <p>Loading applications...</p>}
      {isError && <p className="text-red-600">Failed to load data.</p>}
      {!isLoading && !isError && items.length === 0 && (
        <p>No applications found.</p>
      )}

      {/* List */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Applied</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {items.map((app: JobApplicationDto) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link
                      to={`/applications/${app.id}`}
                      className="text-blue-700 hover:underline"
                    >
                      {app.positionTitle}
                    </Link>
                  </td>

                  <td className="px-4 py-2 align-top">
                    {app.companyId ? (
                      <Link
                        to={`/companies/${app.companyId}`}
                        className="text-sm text-blue-700 hover:underline"
                      >
                        {app.companyName || "Unknown company"}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-500">No company</span>
                    )}
                  </td>

                  <td className="px-4 py-2 align-top">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="px-4 py-2">
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/applications/${app.id}/edit`}
                        className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagedResult && (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 text-xs">
              <div>
                Page {pagedResult.pageNumber} of {pagedResult.totalPages} •{" "}
                {pagedResult.totalCount} total
              </div>

              <div className="flex gap-2">
                <button
                  disabled={!pagedResult.hasPrevious}
                  onClick={() => handlePageChange(pagedResult.pageNumber - 1)}
                  className="rounded-md border px-2 py-1 disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  disabled={!pagedResult.hasNext}
                  onClick={() => handlePageChange(pagedResult.pageNumber + 1)}
                  className="rounded-md border px-2 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
