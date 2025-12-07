import { Link, useNavigate, useParams } from "react-router-dom";
import { StatusBadge } from "../components/StatusBadge";
import { useJobApplication } from "../hooks/useJobApplication";
import { useDeleteJobApplication } from "../hooks/useJobApplicationMutations";

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export function JobApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No application id provided in URL.
      </div>
    );
  }

  const { data, isLoading, isError } = useJobApplication(id);
  const deleteMutation = useDeleteJobApplication();

  const result = data;
  const app = result?.data;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job application?",
    );
    if (!confirmed) return;

    await deleteMutation.mutateAsync(id);
    navigate("/applications");
  };

  if (isLoading) {
    return <p>Loading application...</p>;
  }

  if (isError || !result?.isSuccess || !app) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load this job application.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {app.positionTitle}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Link
              to={`/companies/${app.companyId}`}
              className="font-medium text-blue-700 hover:underline"
            >
              {app.companyName}
            </Link>
            <span>•</span>
            <StatusBadge status={app.status} />
            {app.priority && (
              <>
                <span>•</span>
                <span>Priority {app.priority}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/applications/${app.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
          <Link
            to="/applications"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to list
          </Link>
        </div>
      </div>

      {/* Main details card */}
      <div className="grid gap-6 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-3 text-sm">
          <DetailRow label="Company">
            <Link
              to={`/companies/${app.companyId}`}
              className="text-blue-700 hover:underline"
            >
              {app.companyName}
            </Link>
          </DetailRow>

          <DetailRow label="Position title">{app.positionTitle}</DetailRow>

          <DetailRow label="Status">
            <StatusBadge status={app.status} />
          </DetailRow>

          <DetailRow label="Applied date">
            {formatDate(app.appliedDate)}
          </DetailRow>

          <DetailRow label="Last updated">
            {formatDate(app.lastUpdated)}
          </DetailRow>
        </div>

        <div className="space-y-3 text-sm">
          <DetailRow label="Contact email">
            {app.contactEmail ? (
              <a
                href={`mailto:${app.contactEmail}`}
                className="text-blue-700 hover:underline"
              >
                {app.contactEmail}
              </a>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Contact phone">
            {app.contactPhone ? (
              <a
                href={`tel:${app.contactPhone}`}
                className="text-blue-700 hover:underline"
              >
                {app.contactPhone}
              </a>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Source">{app.source ?? "—"}</DetailRow>

          <DetailRow label="Priority">
            {app.priority ? String(app.priority) : "—"}
          </DetailRow>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">Notes</h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {app.notes?.trim() || "No notes added yet."}
        </p>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-sm text-slate-800">{children}</span>
    </div>
  );
}
