// src/features/jobApplications/pages/EditJobApplicationPage.tsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ApplicationStatusLabels,
  type ApplicationStatus,
} from "../../../types/JobApplication";

import { useJobApplication } from "../hooks/useJobApplication";
import { useUpdateJobApplication } from "../hooks/useJobApplicationMutations";

// -----------------------------
// 1) Schema (same as Create)
// -----------------------------
const jobApplicationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  positionTitle: z.string().min(2, "Position title is required"),

  status: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]) as z.ZodType<ApplicationStatus>,

  appliedDate: z.string().optional(),

  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),

  contactPhone: z.string().optional().or(z.literal("")),
  source: z.string().optional().or(z.literal("")),
  priority: z.union([z.number().int().min(1).max(5), z.nan()]).optional(),
  notes: z.string().optional().or(z.literal("")),
});

// -----------------------------
// 2) Form type
// -----------------------------
type JobApplicationFormValues = {
  companyId: string;
  positionTitle: string;
  status: ApplicationStatus;
  appliedDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  source?: string;
  priority?: number;
  notes?: string;
};

// helper to convert ISO date → yyyy-MM-dd for input
function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// -----------------------------
// 3) Component
// -----------------------------
export function EditJobApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    // This shouldn't normally happen, but just in case:
    return <p className="text-red-600">Missing application id in URL.</p>;
  }

  const applicationQuery = useJobApplication(id);
  const updateMutation = useUpdateJobApplication(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(
      jobApplicationSchema,
    ) as Resolver<JobApplicationFormValues>,
    defaultValues: {
      status: 1, // will be overridden by reset once data is loaded
    },
  });

  // -----------------------------
  // 4) Populate form when data loads
  // -----------------------------
  useEffect(() => {
    const result = applicationQuery.data;
    const app = result?.data;

    if (result?.isSuccess && app) {
      reset({
        companyId: app.companyId,
        positionTitle: app.positionTitle,
        status: app.status,
        appliedDate: toDateInputValue(app.appliedDate),
        contactEmail: app.contactEmail ?? "",
        contactPhone: app.contactPhone ?? "",
        source: app.source ?? "",
        priority: app.priority ?? undefined,
        notes: app.notes ?? "",
      });
    }
  }, [applicationQuery.data, reset]);

  // -----------------------------
  // 5) Submit handler
  // -----------------------------
  const onSubmit = async (values: JobApplicationFormValues) => {
    try {
      const payload = {
        companyId: values.companyId,
        positionTitle: values.positionTitle,
        status: values.status,
        appliedDate: values.appliedDate
          ? new Date(values.appliedDate).toISOString()
          : undefined,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
        source: values.source || undefined,
        priority: Number.isNaN(values.priority) ? undefined : values.priority,
        notes: values.notes || undefined,
      };

      const result = await updateMutation.mutateAsync(payload);

      if (!result.isSuccess) {
        const message =
          result.errors?.join(", ") || "Failed to update job application.";
        setError("root", { message });
        return;
      }

      navigate("/applications");
    } catch (err) {
      console.error(err);
      setError("root", {
        message: "Unexpected error occurred. Please try again.",
      });
    }
  };

  // -----------------------------
  // 6) Loading / error state
  // -----------------------------
  if (applicationQuery.isLoading) {
    return <p>Loading application...</p>;
  }

  const loaded = applicationQuery.data;
  const appDto = loaded?.data;

  if (applicationQuery.isError || !loaded?.isSuccess || !appDto) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load this job application.
      </div>
    );
  }

  // -----------------------------
  // 7) UI (same layout as Create, just text tweaks)
  // -----------------------------
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Job Application</h1>
          <p className="text-sm text-slate-600">
            Update the details of this job application.
          </p>
        </div>
        <Link
          to="/applications"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to list
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
      >
        {/* Top-level error */}
        {"root" in errors && errors.root?.message && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        {/* Company (fixed for now, since changing company is usually rare;
            if you want to allow changing company too, we can reuse useCompanyOptions here like the create page) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Company</label>
          <input
            type="text"
            value={appDto.companyName}
            disabled
            className="rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
          <p className="text-xs text-slate-500">
            Company is fixed for existing applications. (We can make this
            editable later if needed.)
          </p>
        </div>

        {/* Position title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Position title</label>
          <input
            type="text"
            {...register("positionTitle")}
            className="rounded-md border px-3 py-2 text-sm"
          />
          {errors.positionTitle && (
            <p className="text-xs text-red-600">
              {errors.positionTitle.message}
            </p>
          )}
        </div>

        {/* Status & Applied date */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Status</label>
            <select
              {...register("status", { valueAsNumber: true })}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {([0, 1, 2, 3, 4, 5] as ApplicationStatus[]).map((s) => (
                <option key={s} value={s}>
                  {ApplicationStatusLabels[s]}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Applied date</label>
            <input
              type="date"
              {...register("appliedDate")}
              className="rounded-md border px-3 py-2 text-sm"
            />
            {errors.appliedDate && (
              <p className="text-xs text-red-600">
                {errors.appliedDate.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact email</label>
            <input
              type="email"
              {...register("contactEmail")}
              className="rounded-md border px-3 py-2 text-sm"
            />
            {errors.contactEmail && (
              <p className="text-xs text-red-600">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact phone</label>
            <input
              type="tel"
              {...register("contactPhone")}
              className="rounded-md border px-3 py-2 text-sm"
            />
            {errors.contactPhone && (
              <p className="text-xs text-red-600">
                {errors.contactPhone.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Source & priority */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Source</label>
            <input
              type="text"
              {...register("source")}
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="LinkedIn, Company site, Referral..."
            />
            {errors.source && (
              <p className="text-xs text-red-600">
                {errors.source.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Priority <span className="text-xs text-slate-500">(1–5)</span>
            </label>
            <input
              type="number"
              min={1}
              max={5}
              {...register("priority", { valueAsNumber: true })}
              className="rounded-md border px-3 py-2 text-sm"
            />
            {errors.priority && (
              <p className="text-xs text-red-600">
                {errors.priority.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            rows={4}
            {...register("notes")}
            className="rounded-md border px-3 py-2 text-sm"
          />
          {errors.notes && (
            <p className="text-xs text-red-600">
              {errors.notes.message as string}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Link
            to="/applications"
            className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting || updateMutation.isPending
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
