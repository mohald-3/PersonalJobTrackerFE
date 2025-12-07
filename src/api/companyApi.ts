import { axiosClient } from "./axiosClient";
import type { CompanyDto } from "../types/Company";
import type { OperationResult } from "../types/OperationResult";
import type { PagedResult } from "../types/PagedResult";

export interface CompanyQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  country?: string;
  industry?: string;
}

export interface CreateCompanyRequest {
  name: string;
  orgNumber?: string;
  city?: string;
  country?: string;
  industry?: string;
  websiteUrl?: string;
  notes?: string;
}

export interface UpdateCompanyRequest extends CreateCompanyRequest {}

export const companyApi = {
  getCompanies: (params: CompanyQueryParams) =>
    axiosClient.get<OperationResult<PagedResult<CompanyDto>>>(
      "/api/companies",
      {
        params,
      },
    ),

  getCompanyById: (id: string) =>
    axiosClient.get<OperationResult<CompanyDto>>(`/api/companies/${id}`),

  createCompany: (payload: CreateCompanyRequest) =>
    axiosClient.post<OperationResult<CompanyDto>>("/api/companies", payload),

  updateCompany: (id: string, payload: UpdateCompanyRequest) =>
    axiosClient.put<OperationResult<CompanyDto>>(
      `/api/companies/${id}`,
      payload,
    ),

  deleteCompany: (id: string) =>
    axiosClient.delete<OperationResult<null>>(`/api/companies/${id}`),
};
