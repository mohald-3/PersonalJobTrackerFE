import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../../../api/companyApi";
import type { CreateCompanyRequest } from "../../../api/companyApi";
import type { OperationResult } from "../../../types/OperationResult";
import type { CompanyDto } from "../../../types/Company";
import { CompanyForm, type CompanyFormValues } from "../components/CompanyForm";

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const mutation = useMutation<
    OperationResult<CompanyDto>,
    Error,
    CompanyFormValues
  >({
    mutationFn: async (values) => {
      setServerErrors([]);

      const payload: CreateCompanyRequest = {
        name: values.name.trim(),
        orgNumber: values.orgNumber || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        industry: values.industry || undefined,
        websiteUrl: values.websiteUrl || undefined,
        notes: values.notes || undefined,
      };

      const response = await companyApi.createCompany(payload);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.isSuccess && result.data) {
        // refresh companies list cache
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        navigate("/companies");
      } else {
        setServerErrors(result.errors ?? ["Unknown error from server"]);
      }
    },
    onError: (err) => {
      setServerErrors([err.message || "Network or server error"]);
    },
  });

  const handleSubmit = (values: CompanyFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold mb-1">Create company</h1>
        <p className="text-sm text-slate-600">
          Add a new company to your PersonalJobTracker.
        </p>
      </div>

      <CompanyForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        serverErrors={serverErrors}
      />
    </div>
  );
}
