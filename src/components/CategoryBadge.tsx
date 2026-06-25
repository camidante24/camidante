interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({category}: CategoryBadgeProps) {
  return (
    <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant font-sans text-xs font-semibold tracking-widest uppercase rounded-full border border-outline/10">
      {category}
    </span>
  );
}
