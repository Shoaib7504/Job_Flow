import { cn } from "@/lib/utils";

export default function SectionMark({ n, title, className }) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="num text-sm text-primary">/{n}</span>
      <span className="label-caps">{title}</span>
    </div>
  );
}