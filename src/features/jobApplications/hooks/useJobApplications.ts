import { useQuery } from "@tanstack/react-query";
import type { JobApplicationQueryParams } from "../../../types/JobApplication";
import { getJobApplications } from "../../../api/jobApplicationApi";

export function useJobApplications(params: JobApplicationQueryParams) {
  return useQuery({
    queryKey: ["jobApplications", params],
    queryFn: () => getJobApplications(params),
  });
}
