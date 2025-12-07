import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  type UpsertJobApplicationRequest,
} from "../../../api/jobApplicationApi";

export function useCreateJobApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertJobApplicationRequest) =>
      createJobApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
  });
}

export function useUpdateJobApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertJobApplicationRequest) =>
      updateJobApplication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      queryClient.invalidateQueries({ queryKey: ["jobApplication", id] });
    },
  });
}

export function useDeleteJobApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJobApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
  });
}
