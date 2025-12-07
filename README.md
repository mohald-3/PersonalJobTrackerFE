# 📌 **PersonalJobTracker — Frontend (React + TypeScript)**

A modern full-stack application for organizing job applications and tracking your internship/job search progress.
This is the **frontend** for the project, built with **React, TypeScript, Vite, TailwindCSS, Axios, React Query, React Hook Form, and Zod**.

The frontend consumes a backend API built with **ASP.NET Core (.NET 8)** and follows a strict contract for `OperationResult<T>` and `PagedResult<T>` response models.

---

## 🚀 **Features**

### ✔ Companies Module

* View all companies with pagination, search, and filters.
* Create, edit, and delete companies.
* Clean UI with loading skeletons and delayed loading transitions.

### ✔ Job Applications Module

* Full CRUD for job applications.
* Filter by status, company, date range, search.
* Displays company name and links to company details.
* Status badges and clean layout.

### ✔ Dashboard Overview

* Summary panels:

  * Total companies
  * Total applications
  * Applications by status
* Recent applications list
* Top companies by number of applications
* Smooth loading skeletons

### ✔ UX Enhancements

* Global skeleton loader system
* Reusable components
* Grace delay to prevent flicker on fast API calls
* Fully mobile-responsive with TailwindCSS

---

## 🛠 **Tech Stack**

### **Frontend**

* ⚛️ **React 18**
* 🟦 **TypeScript**
* ⚡ **Vite**
* 🎨 **TailwindCSS**
* 🔄 **React Query (TanStack)**
* 📡 **Axios (custom axiosClient)**
* 🧾 **React Hook Form**
* 🧪 **Zod validation**

### **Backend (external repository)**

* ASP.NET Core (.NET 8 Web API)
* OperationResult response contract
* PagedResult pagination
* Job Application / Company endpoints
* Dashboard Overview endpoint

---

## 📁 **Project Structure**

```
src/
  api/
    axiosClient.ts
    companyApi.ts
    jobApplicationApi.ts
    dashboardApi.ts
  components/
    ui/
      Skeleton.tsx
  features/
    companies/
      pages/
      components/
      hooks/
    jobApplications/
      pages/
      components/
      hooks/
    dashboard/
      pages/
      components/
      hooks/
  hooks/
    useDelayedLoading.ts
  types/
    Company.ts
    JobApplication.ts
    OperationResult.ts
    PagedResult.ts
  router/
    index.tsx
```

---

## 🧩 **Backend Contract Summary**

All endpoints return:

```ts
interface OperationResult<T> {
  isSuccess: boolean;
  errors: string[];
  data: T | null;
}
```

Paginated endpoints return:

```ts
interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

Dashboard returns:

```ts
interface DashboardOverviewDto {
  totalCompanies: number;
  totalApplications: number;
  applicationsByStatus: StatusCountDto[];
  recentApplications: JobApplicationDto[];
  topCompaniesByApplications: CompanyApplicationsSummaryDto[];
}
```

---

## 🔧 **Setup Instructions**

### 1. Clone the repository

```bash
git clone https://github.com/mohald-3/PersonalJobTrackerFE.git
cd PersonalJobTrackerFE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```
VITE_API_URL=https://localhost:7010
```

(or whatever your API base URL is)

### 4. Run the dev server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## 🧹 **Code Quality & Conventions**

* Code formatted with **Prettier**
* Imports auto-organized
* Strict TypeScript mode
* API calls isolated in `/api`
* Feature-based folder structure
* Custom hooks for API + caching (React Query)

---

## 🤝 **Future Improvements**

* Dark mode theme
* Global toast notifications
* Better dashboard graphs (Recharts)
* Push to production environment (Azure / Vercel)
* Mobile-focused redesign

Would you like a **badges version** of the README?
