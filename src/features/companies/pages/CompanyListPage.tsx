import { useMemo, useState } from "react";
import { useCompanies } from "../hooks/useCompanies";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyDto } from "../../../types/Company";
import type { OperationResult } from "../../../types/OperationResult";
import { companyApi } from "../../../api/companyApi";

export function CompanyListPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");

  const { data, isLoading, error } = useCompanies({
    pageNumber,
    pageSize,
    search: search || undefined,
    city: city || undefined,
    country: country || undefined,
    industry: industry || undefined,
  });

  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useMutation<OperationResult<null>, Error, string>({
    mutationFn: async (id: string) => {
      setDeleteError(null);
      const response = await companyApi.deleteCompany(id);
      return response.data;
    },
    onSuccess: (result) => {
      if (!result.isSuccess) {
        setDeleteError(result.errors?.join(", ") || "Failed to delete company");
        return;
      }

      // refresh company list
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err) => {
      setDeleteError(err.message || "Network or server error while deleting");
    },
  });

  const handleDelete = (company: CompanyDto) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"?`,
    );
    if (!confirmed) return;

    deleteMutation.mutate(company.id);
  };

  // Build filter option lists from current page data (simple client-side options)
  const { cityOptions, countryOptions, industryOptions } = useMemo(() => {
    const cities = new Set<string>();
    const countries = new Set<string>();
    const industries = new Set<string>();

    if (data?.items) {
      for (const c of data.items) {
        if (c.city) cities.add(c.city);
        if (c.country) countries.add(c.country);
        if (c.industry) industries.add(c.industry);
      }
    }

    return {
      cityOptions: Array.from(cities).sort(),
      countryOptions: Array.from(countries).sort(),
      industryOptions: Array.from(industries).sort(),
    };
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPageNumber(1);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setPageNumber(1);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setPageNumber(1);
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value);
    setPageNumber(1);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4">Companies</h1>
        <p>Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4">Companies</h1>
        <p className="text-red-600">Error: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Companies</h1>
          <p className="text-sm text-slate-600">
            Search and filter your tracked companies.
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            to="/companies/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            + New company
          </Link>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, notes, etc."
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            City
          </label>
          <select
            value={city}
            onChange={handleCityChange}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All cities</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Country
          </label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All countries</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Industry
          </label>
          <select
            value={industry}
            onChange={handleIndustryChange}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All industries</option>
            {industryOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
          {deleteError}
        </div>
      )}

      {/* List + pagination */}
      {!data || data.items.length === 0 ? (
        <p className="text-gray-500">No companies found.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 rounded-md border border-gray-300 bg-white">
            {data.items.map((company) => (
              <li
                key={company.id}
                className="p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <p className="text-sm text-gray-500">
                      {company.city ?? "No city"}
                      {company.country ? `, ${company.country}` : ""}
                    </p>
                    {company.industry && (
                      <p className="text-xs text-slate-500 mt-1">
                        Industry: {company.industry}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {company.websiteUrl && (
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Visit website
                      </a>
                    )}

                    <Link
                      to={`/companies/${company.id}/edit`}
                      className="text-xs font-medium text-slate-700 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(company)}
                      disabled={deleteMutation.isPending}
                      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-slate-600">
              Page {data.pageNumber} of {data.totalPages} · {data.totalCount}{" "}
              companies
            </p>

            <div className="flex gap-2">
              <button
                disabled={!data.hasPrevious}
                onClick={() => setPageNumber((p) => p - 1)}
                className="px-3 py-1.5 rounded bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                disabled={!data.hasNext}
                onClick={() => setPageNumber((p) => p + 1)}
                className="px-3 py-1.5 rounded bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
