// src/features/jobApplications/pages/CreateJobApplicationPage.tsx
import { useNavigate, Link } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ApplicationStatusLabels,
  type ApplicationStatus,
} from "../../../types/JobApplication";

import { useCreateJobApplication } from "../hooks/useJobApplicationMutations";
import { useCompanyOptions } from "../hooks/useCompanyOptions";

// --------------------------------------
// 1) ZOD SCHEMA
// --------------------------------------
const jobApplicationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  positionTitle: z.string().min(2, "Position title is required"),

  // numeric union of your enum values
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

// --------------------------------------
// 2) EXPLICIT FORM TYPE (fixes resolver error)
// --------------------------------------
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

// --------------------------------------
// 3) COMPONENT
// --------------------------------------
export function CreateJobApplicationPage() {
  const navigate = useNavigate();
  const createMutation = useCreateJobApplication();

  const {
    data: companiesResult,
    isLoading: companiesLoading,
    isError: companiesError,
  } = useCompanyOptions();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(
      jobApplicationSchema,
    ) as Resolver<JobApplicationFormValues>,
    defaultValues: {
      status: 0,
    },
  });

  // --------------------------------------
  // 4) SUBMIT HANDLER
  // --------------------------------------
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

      const result = await createMutation.mutateAsync(payload);

      if (!result.isSuccess) {
        const message =
          result.errors?.join(", ") || "Failed to create job application.";
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

  // --------------------------------------
  // 5) COMPANY OPTIONS
  // --------------------------------------
  const pagedCompanies = companiesResult?.data;
  const companies = pagedCompanies?.items ?? [];

  // --------------------------------------
  // 6) UI
  // --------------------------------------
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Job Application</h1>
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
        {/* Top-level server error */}
        {"root" in errors && errors.root?.message && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        {/* COMPANY DROPDOWN */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Company</label>
          <select
            {...register("companyId")}
            className="rounded-md border px-3 py-2 text-sm"
            disabled={companiesLoading || companiesError}
          >
            <option value="">Select company...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {companiesLoading && (
            <p className="text-xs text-slate-500">Loading companies...</p>
          )}
          {companiesError && (
            <p className="text-xs text-red-600">
              Failed to load companies. Try refreshing.
            </p>
          )}
          {errors.companyId && (
            <p className="text-xs text-red-600">{errors.companyId.message}</p>
          )}
        </div>

        {/* POSITION TITLE */}
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

        {/* STATUS + APPLIED DATE */}
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

        {/* CONTACT INFO */}
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

        {/* SOURCE + PRIORITY */}
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

        {/* NOTES */}
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

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-2">
          <Link
            to="/applications"
            className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting || createMutation.isPending
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
