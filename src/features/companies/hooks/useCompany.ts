import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../../../api/companyApi";
import type { CompanyDto } from "../../../types/Company";
import type { OperationResult } from "../../../types/OperationResult";

export function useCompany(id: string | undefined) {
  return useQuery<CompanyDto, Error>({
    queryKey: ["company", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        throw new Error("Missing company id");
      }

      const response = await companyApi.getCompanyById(id);
      const result: OperationResult<CompanyDto> = response.data;

      if (!result.isSuccess || !result.data) {
        throw new Error(result.errors?.join(", ") || "Failed to load company");
      }

      return result.data;
    },
  });
}
