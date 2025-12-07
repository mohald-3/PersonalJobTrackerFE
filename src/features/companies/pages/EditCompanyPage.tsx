import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompany } from "../hooks/useCompany";
import { companyApi } from "../../../api/companyApi";
import type { UpdateCompanyRequest } from "../../../api/companyApi";
import type { OperationResult } from "../../../types/OperationResult";
import type { CompanyDto } from "../../../types/Company";
import { CompanyForm, type CompanyFormValues } from "../components/CompanyForm";

export function EditCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const { data: company, isLoading, error } = useCompany(id);

  const mutation = useMutation<
    OperationResult<CompanyDto>,
    Error,
    CompanyFormValues
  >({
    mutationFn: async (values) => {
      if (!id) {
        throw new Error("Missing company id");
      }

      setServerErrors([]);

      const payload: UpdateCompanyRequest = {
        name: values.name.trim(),
        orgNumber: values.orgNumber || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        industry: values.industry || undefined,
        websiteUrl: values.websiteUrl || undefined,
        notes: values.notes || undefined,
      };

      const response = await companyApi.updateCompany(id, payload);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.isSuccess && result.data) {
        // Refresh list + this company’s cache
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["company", id] });
        navigate("/companies");
      } else {
        setServerErrors(result.errors ?? ["Unknown error from server"]);
      }
    },
    onError: (err) => {
      setServerErrors([err.message || "Network or server error"]);
    },
  });

  if (!id) {
    return <p className="text-red-600">Missing company id.</p>;
  }

  if (isLoading) {
    return <p>Loading company...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Error loading company: {(error as Error).message}
      </p>
    );
  }

  if (!company) {
    return <p className="text-gray-600">Company not found.</p>;
  }

  const defaultValues: CompanyFormValues = {
    name: company.name,
    orgNumber: company.orgNumber ?? "",
    city: company.city ?? "",
    country: company.country ?? "",
    industry: company.industry ?? "",
    websiteUrl: company.websiteUrl ?? "",
    notes: company.notes ?? "",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold mb-1">Edit company</h1>
        <p className="text-sm text-slate-600">
          Update information for{" "}
          <span className="font-semibold">{company.name}</span>.
        </p>
      </div>

      <CompanyForm
        defaultValues={defaultValues}
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
        serverErrors={serverErrors}
      />
    </div>
  );
}
