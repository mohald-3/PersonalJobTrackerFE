import { axiosClient } from "./axiosClient";
import type { OperationResult } from "../types/OperationResult";
import type {
  ApplicationStatus,
  JobApplicationDto,
} from "../types/JobApplication";

export interface StatusCountDto {
  status: ApplicationStatus;
  count: number;
}

export interface CompanyApplicationsSummaryDto {
  companyId: string;
  companyName: string;
  applicationsCount: number;
}

export interface DashboardOverviewDto {
  totalCompanies: number;
  totalApplications: number;
  applicationsByStatus: StatusCountDto[];
  recentApplications: JobApplicationDto[];
  topCompaniesByApplications: CompanyApplicationsSummaryDto[];
}

export const dashboardApi = {
  getOverview: () =>
    axiosClient.get<OperationResult<DashboardOverviewDto>>(
      "/api/dashboard/overview",
    ),
};
