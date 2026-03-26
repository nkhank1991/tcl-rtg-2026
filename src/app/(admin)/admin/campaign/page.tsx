"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Save, ChevronRight, Loader2 } from "lucide-react";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  state: CampaignState;
  heroImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  config: unknown;
  createdAt: string;
  updatedAt: string;
}

type CampaignState = "PRE_LAUNCH" | "LAUNCH" | "SCREENING" | "LIVE" | "POST_EVENT";

const STATE_ORDER: CampaignState[] = [
  "PRE_LAUNCH",
  "LAUNCH",
  "SCREENING",
  "LIVE",
  "POST_EVENT",
];

const STATE_COLORS: Record<CampaignState, string> = {
  PRE_LAUNCH: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LAUNCH: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SCREENING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  LIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  POST_EVENT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const STATE_LABELS: Record<CampaignState, string> = {
  PRE_LAUNCH: "Pre-Launch",
  LAUNCH: "Launch",
  SCREENING: "Screening",
  LIVE: "Live",
  POST_EVENT: "Post-Event",
};

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdminCampaignPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ campaign: Campaign }>({
    queryKey: ["admin", "campaign"],
    queryFn: async () => {
      const res = await fetch("/api/admin/campaign");
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
  });

  const campaign = data?.campaign;

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title);
      setTagline(campaign.tagline);
      setStartDate(toDatetimeLocal(campaign.startDate));
      setEndDate(toDatetimeLocal(campaign.endDate));
    }
  }, [campaign]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/admin/campaign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update campaign");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "campaign"] });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      title,
      tagline,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    });
  };

  const handleStateTransition = (newState: CampaignState) => {
    updateMutation.mutate({ state: newState });
  };

  const currentStateIndex = campaign
    ? STATE_ORDER.indexOf(campaign.state)
    : -1;
  const nextState =
    currentStateIndex >= 0 && currentStateIndex < STATE_ORDER.length - 1
      ? STATE_ORDER[currentStateIndex + 1]
      : null;
  const prevState =
    currentStateIndex > 0 ? STATE_ORDER[currentStateIndex - 1] : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Campaign" description="Manage campaign settings and state" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Campaign" description="Manage campaign settings and state" />
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50">No campaign found. Create one first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Campaign"
        description="Manage campaign settings and state"
      />

      {/* Current State */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
          Campaign State
        </h3>

        <div className="flex items-center gap-3 mb-6">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATE_COLORS[campaign.state]}`}
          >
            {STATE_LABELS[campaign.state]}
          </span>
          <span className="text-sm text-white/30">
            {campaign.slug}
          </span>
        </div>

        {/* State timeline */}
        <div className="flex items-center gap-1 mb-6">
          {STATE_ORDER.map((state, i) => {
            const isCurrent = state === campaign.state;
            const isPast = i < currentStateIndex;
            return (
              <div key={state} className="flex items-center gap-1">
                <div
                  className={`flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-[#E4002B] text-white"
                      : isPast
                        ? "bg-white/10 text-white/60"
                        : "bg-white/5 text-white/20"
                  }`}
                >
                  {STATE_LABELS[state]}
                </div>
                {i < STATE_ORDER.length - 1 && (
                  <ChevronRight size={14} className="text-white/20" />
                )}
              </div>
            );
          })}
        </div>

        {/* State transition buttons */}
        <div className="flex items-center gap-3">
          {prevState && (
            <button
              onClick={() => handleStateTransition(prevState)}
              disabled={updateMutation.isPending}
              className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Back to {STATE_LABELS[prevState]}
            </button>
          )}
          {nextState && (
            <button
              onClick={() => handleStateTransition(nextState)}
              disabled={updateMutation.isPending}
              className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
              ) : null}
              Advance to {STATE_LABELS[nextState]}
            </button>
          )}
          {!nextState && !prevState && (
            <p className="text-sm text-white/40">
              Campaign has completed all states.
            </p>
          )}
        </div>
      </div>

      {/* Edit Fields */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
          Campaign Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>

          {updateMutation.isSuccess && (
            <span className="text-sm text-green-400">Saved successfully</span>
          )}
          {updateMutation.isError && (
            <span className="text-sm text-red-400">
              {updateMutation.error?.message || "Failed to save"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
