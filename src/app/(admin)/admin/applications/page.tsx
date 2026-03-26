"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

type StatusLog = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string | null;
  reason: string | null;
  createdAt: string;
};

type Application = {
  id: string;
  userId: string;
  status: string;
  teamName: string;
  formData: Record<string, unknown>;
  notes: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; phone: string; email: string | null };
  statusLogs: StatusLog[];
};

const ALL_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "RESERVE",
  "CONFIRMED",
  "NOT_SELECTED",
] as const;

const statusBadge: Record<string, string> = {
  SUBMITTED: "bg-blue-500/20 text-blue-400",
  UNDER_REVIEW: "bg-yellow-500/20 text-yellow-400",
  SHORTLISTED: "bg-purple-500/20 text-purple-400",
  CONFIRMED: "bg-green-500/20 text-green-400",
  NOT_SELECTED: "bg-red-500/20 text-red-400",
  RESERVE: "bg-orange-500/20 text-orange-400",
};

const inputClass =
  "w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none";
const primaryBtn =
  "rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors";
const secondaryBtn =
  "rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors";
const card = "rounded-xl border border-white/10 bg-white/5 p-4";

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = useState<Record<string, string>>({});
  const [statusReason, setStatusReason] = useState<Record<string, string>>({});

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["admin", "applications", filterStatus],
    queryFn: async () => {
      const params = filterStatus ? `?status=${filterStatus}` : "";
      const res = await fetch(`/api/admin/applications${params}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; notes?: string; reason?: string };
    }) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
  });

  function handleUpdateApplication(id: string) {
    const data: { status?: string; notes?: string; reason?: string } = {};
    if (editStatus[id]) data.status = editStatus[id];
    if (editNotes[id] !== undefined) data.notes = editNotes[id];
    if (statusReason[id]) data.reason = statusReason[id];
    updateMutation.mutate({ id, data });
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const app = applications.find((a) => a.id === id);
      if (app) {
        setEditNotes((prev) => ({ ...prev, [id]: app.notes ?? "" }));
        setEditStatus((prev) => ({ ...prev, [id]: app.status }));
      }
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Applications"
        description="Review and manage team applications"
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-white/40" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <p className="text-sm text-white/50">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-white/50">No applications found.</p>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_140px_140px_40px] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-white/40">
            <span>Team Name</span>
            <span>Applicant</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>

          {applications.map((app) => {
            const fullName =
              (app.formData?.fullName as string) ??
              app.user.name ??
              "Unknown";
            const isExpanded = expandedId === app.id;

            return (
              <div key={app.id} className={card}>
                <button
                  onClick={() => toggleExpand(app.id)}
                  className="grid w-full grid-cols-[1fr_1fr_140px_140px_40px] items-center gap-4 text-left"
                >
                  <span className="text-sm font-medium text-white">
                    {app.teamName}
                  </span>
                  <span className="text-sm text-white/70">{fullName}</span>
                  <span>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[app.status] ?? "bg-gray-500/20 text-gray-400"}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </span>
                  <span className="text-sm text-white/50">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-white/40">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                    {/* Form Data */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-white">
                        Form Data
                      </h4>
                      <div className="rounded-lg bg-white/5 p-3">
                        {Object.entries(app.formData).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex gap-2 py-1 text-sm"
                          >
                            <span className="font-medium text-white/60">
                              {key}:
                            </span>
                            <span className="text-white/80">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Change */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm text-white/60">
                          Change Status
                        </label>
                        <select
                          value={editStatus[app.id] ?? app.status}
                          onChange={(e) =>
                            setEditStatus((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          className={inputClass}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-white/60">
                          Reason for Status Change
                        </label>
                        <input
                          type="text"
                          placeholder="Optional reason"
                          value={statusReason[app.id] ?? ""}
                          onChange={(e) =>
                            setStatusReason((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="mb-1 block text-sm text-white/60">
                        Notes
                      </label>
                      <textarea
                        value={editNotes[app.id] ?? ""}
                        onChange={(e) =>
                          setEditNotes((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                        className={`${inputClass} min-h-[60px] resize-y`}
                        placeholder="Internal notes..."
                      />
                    </div>

                    <button
                      onClick={() => handleUpdateApplication(app.id)}
                      disabled={updateMutation.isPending}
                      className={primaryBtn}
                    >
                      {updateMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    {/* Status History */}
                    {app.statusLogs.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-white">
                          Status History
                        </h4>
                        <div className="space-y-1">
                          {app.statusLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center gap-2 text-xs text-white/50"
                            >
                              <span>
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                              <span>
                                {log.fromStatus ? (
                                  <>
                                    <span
                                      className={`inline-block rounded px-1.5 py-0.5 ${statusBadge[log.fromStatus] ?? ""}`}
                                    >
                                      {log.fromStatus.replace("_", " ")}
                                    </span>
                                    {" -> "}
                                  </>
                                ) : null}
                                <span
                                  className={`inline-block rounded px-1.5 py-0.5 ${statusBadge[log.toStatus] ?? ""}`}
                                >
                                  {log.toStatus.replace("_", " ")}
                                </span>
                              </span>
                              {log.reason && (
                                <span className="text-white/40">
                                  ({log.reason})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
