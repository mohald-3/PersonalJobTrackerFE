import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../../../api/companyApi";
import type { CompanyQueryParams } from "../../../api/companyApi";
import type { CompanyDto } from "../../../types/Company";
import type { PagedResult } from "../../../types/PagedResult";
import type { OperationResult } from "../../../types/OperationResult";

export function useCompanies(params: CompanyQueryParams) {
  return useQuery<PagedResult<CompanyDto>, Error>({
    queryKey: ["companies", params],
    queryFn: async () => {
      const response = await companyApi.getCompanies(params);
      const result: OperationResult<PagedResult<CompanyDto>> = response.data;

      if (!result.isSuccess || !result.data) {
        throw new Error(
          result.errors?.join(", ") || "Failed to load companies",
        );
      }

      return result.data;
    },
  });
}
