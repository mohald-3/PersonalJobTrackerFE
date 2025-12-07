import { useQuery } from "@tanstack/react-query";
import { getJobApplicationById } from "../../../api/jobApplicationApi";

export function useJobApplication(id: string | undefined) {
  return useQuery({
    queryKey: ["jobApplication", id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("No id provided"));
      }
      return getJobApplicationById(id);
    },
    enabled: !!id,
  });
}
