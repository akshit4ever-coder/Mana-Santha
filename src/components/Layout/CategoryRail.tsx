import React from "react";
import { Link } from "@/router";

type Cat = any;

export function CategoryRail({
  categories,
  subcategories,
  currentSlug,
  selectedSubcategoryId,
  onSelectSubcategory,
}: {
  categories: Cat[];
  subcategories: Cat[];
  currentSlug?: string | null;
  selectedSubcategoryId?: string | null;
  onSelectSubcategory?: (id: string | null) => void;
}) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:items-center lg:w-20 lg:pt-6">
      <div className="flex flex-col gap-3 sticky top-24">
        <button onClick={() => onSelectSubcategory?.(null)} className={`flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === null ? "ring-2 ring-primary" : "hover:bg-secondary"}`}>
          <div className="h-10 w-10 flex items-center justify-center rounded-md bg-card p-1">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-xs text-center">All</div>
        </button>

        {subcategories?.map((s: any) => (
          <button key={s.id} onClick={() => onSelectSubcategory?.(s.id)} className={`flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === s.id ? "ring-2 ring-primary" : "hover:bg-secondary"}`}>
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-md bg-card">
              {s.image_url ? <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" /> : <div className="h-6 w-6 bg-muted" />}
            </div>
            <div className="text-xs text-center line-clamp-1 w-16">{s.name}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default CategoryRail;
