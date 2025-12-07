import { axiosClient } from "./axiosClient";
import type {
  JobApplicationDto,
  JobApplicationQueryParams,
  ApplicationStatus,
} from "../types/JobApplication";
import type { OperationResult } from "../types/OperationResult";
import type { PagedResult } from "../types/PagedResult";

const baseUrl = "/api/jobapplications";

export async function getJobApplications(
  params: JobApplicationQueryParams,
): Promise<OperationResult<PagedResult<JobApplicationDto>>> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append("search", params.search);

  if (params.status !== undefined) {
    // status is numeric (0..5) → convert to string for the query
    searchParams.append("status", String(params.status));
  }

  if (params.companyId) searchParams.append("companyId", params.companyId);
  if (params.fromDate) searchParams.append("fromDate", params.fromDate);
  if (params.toDate) searchParams.append("toDate", params.toDate);
  if (params.pageNumber)
    searchParams.append("pageNumber", params.pageNumber.toString());
  if (params.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response =
    await axiosClient.get<OperationResult<PagedResult<JobApplicationDto>>>(url);

  return response.data;
}

export async function getJobApplicationById(
  id: string,
): Promise<OperationResult<JobApplicationDto>> {
  const response = await axiosClient.get<OperationResult<JobApplicationDto>>(
    `${baseUrl}/${id}`,
  );
  return response.data;
}

export interface UpsertJobApplicationRequest {
  companyId: string;
  positionTitle: string;
  status: ApplicationStatus; // numeric enum 0..5
  appliedDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  source?: string;
  priority?: number;
  notes?: string;
}

export async function createJobApplication(
  payload: UpsertJobApplicationRequest,
): Promise<OperationResult<JobApplicationDto>> {
  const response = await axiosClient.post<OperationResult<JobApplicationDto>>(
    baseUrl,
    payload,
  );
  return response.data;
}

export async function updateJobApplication(
  id: string,
  payload: UpsertJobApplicationRequest,
): Promise<OperationResult<JobApplicationDto>> {
  const response = await axiosClient.put<OperationResult<JobApplicationDto>>(
    `${baseUrl}/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteJobApplication(id: string): Promise<void> {
  await axiosClient.delete(`${baseUrl}/${id}`);
}
