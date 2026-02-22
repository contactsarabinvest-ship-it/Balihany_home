import { Star } from "lucide-react";

interface RatingBadgeProps {
  avg: number;
  count: number;
}

export function RatingBadge({ avg, count }: RatingBadgeProps) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium">{avg.toFixed(1)}</span>
      <span className="text-muted-foreground">({count})</span>
    </div>
  );
}
