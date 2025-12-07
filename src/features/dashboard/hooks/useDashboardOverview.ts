import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboardApi";
import type { DashboardOverviewDto } from "../../../api/dashboardApi";
import type { OperationResult } from "../../../types/OperationResult";

export function useDashboardOverview() {
  return useQuery<OperationResult<DashboardOverviewDto>, Error>({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const response = await dashboardApi.getOverview();
      return response.data;
    },
  });
}
