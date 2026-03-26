"use client";

interface MatchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = [
  "All",
  "Live",
  "Upcoming",
  "Completed",
  "Group Stage",
  "Knockouts",
];

export function MatchFilters({ activeFilter, onFilterChange }: MatchFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? "bg-tcl-red text-white"
              : "bg-bg-elevated text-text-secondary hover:text-text-primary"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
