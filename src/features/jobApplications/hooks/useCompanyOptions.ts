// src/features/jobApplications/hooks/useCompanyOptions.ts
import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../../../api/companyApi";
import type { CompanyDto } from "../../../types/Company";
import type { OperationResult } from "../../../types/OperationResult";
import type { PagedResult } from "../../../types/PagedResult";

export function useCompanyOptions() {
  return useQuery<OperationResult<PagedResult<CompanyDto>>>({
    queryKey: ["companies", "options"],
    queryFn: async () => {
      const response = await companyApi.getCompanies({
        pageNumber: 1,
        pageSize: 100,
      });

      return response.data;
    },
  });
}
