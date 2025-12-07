// Backend uses a numeric enum (0..5). We represent it as a numeric union.
export type ApplicationStatus =
  | 0 // Planned
  | 1 // Applied
  | 2 // Interview
  | 3 // Offer
  | 4 // Rejected
  | 5; // Hired

// Optional: helper labels if you want human-readable status later
export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  0: "Planned",
  1: "Applied",
  2: "Interview",
  3: "Offer",
  4: "Rejected",
  5: "Hired",
};

export interface JobApplicationDto {
  id: string;
  companyId: string;
  companyName: string;
  positionTitle: string;
  status: ApplicationStatus;
  appliedDate?: string;   // ISO string
  lastUpdated: string;    // ISO string
  contactEmail?: string;
  contactPhone?: string;
  source?: string;
  priority?: number;
  notes?: string;
}

export interface JobApplicationQueryParams {
  search?: string;
  status?: ApplicationStatus;
  companyId?: string;
  fromDate?: string; // yyyy-MM-dd (for filters)
  toDate?: string;   // yyyy-MM-dd
  pageNumber?: number;
  pageSize?: number;
}
