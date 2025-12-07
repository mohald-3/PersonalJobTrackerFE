import { Routes, Route, NavLink, Link } from "react-router-dom";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { CompanyListPage } from "../features/companies/pages/CompanyListPage";
import { CreateCompanyPage } from "../features/companies/pages/CreateCompanyPage";
import { EditCompanyPage } from "../features/companies/pages/EditCompanyPage";
import JobApplicationListPage from "../features/jobApplications/pages/JobApplicationListPage";
import { CreateJobApplicationPage } from "../features/jobApplications/pages/CreateJobApplicationPage";
import { EditJobApplicationPage } from "../features/jobApplications/pages/EditJobApplicationPage";
import { JobApplicationDetailsPage } from "../features/jobApplications/pages/JobApplicationDetailsPage";

export function AppRouter() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            PersonalJobTracker
          </Link>
          <nav className="flex gap-4">
            <NavLink
              to="/companies"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-slate-600"
                }`
              }
            >
              Companies
            </NavLink>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-slate-600"
                }`
              }
            >
              Applications
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/companies" element={<CompanyListPage />} />
          <Route path="/companies/create" element={<CreateCompanyPage />} />
          <Route path="/companies/:id/edit" element={<EditCompanyPage />} />

          <Route path="/applications" element={<JobApplicationListPage />} />
          <Route
            path="/applications/create"
            element={<CreateJobApplicationPage />}
          />
          <Route
            path="/applications/:id"
            element={<JobApplicationDetailsPage />}
          />
          <Route
            path="/applications/:id/edit"
            element={<EditJobApplicationPage />}
          />
        </Routes>
      </main>
    </div>
  );
}
