import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const companySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  orgNumber: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  // Keep websiteUrl optional; we'll handle empty string later in the page
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  defaultValues?: Partial<CompanyFormValues>;
  onSubmit: SubmitHandler<CompanyFormValues>;
  isSubmitting?: boolean;
  serverErrors?: string[];
}

export function CompanyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  serverErrors,
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl bg-white p-4 rounded-md shadow-sm border border-slate-200"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Org number
          </label>
          <input
            type="text"
            {...register("orgNumber")}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            {...register("industry")}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            City
          </label>
          <input
            type="text"
            {...register("city")}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Country
          </label>
          <input
            type="text"
            {...register("country")}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Website
        </label>
        <input
          type="url"
          {...register("websiteUrl")}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com"
        />
        {errors.websiteUrl && (
          <p className="text-xs text-red-600 mt-1">
            {errors.websiteUrl.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          rows={3}
          {...register("notes")}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {serverErrors && serverErrors.length > 0 && (
        <div className="rounded-md border border-red-300 bg-red-50 p-2">
          <p className="text-xs font-semibold text-red-700 mb-1">
            Could not save company:
          </p>
          <ul className="list-disc list-inside text-xs text-red-700">
            {serverErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-md bg-blue-600 text-sm font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : "Save company"}
        </button>
      </div>
    </form>
  );
}
