import { useEffect, useState, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  change: string;
  changePositive: boolean;
  colorClass: string;
  delay?: number;
}

const useCountUp = (target: number, duration = 1200, delay = 0) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return { count, ref };
};

const StatCard = ({ icon: Icon, value, label, change, changePositive, colorClass, delay = 0 }: StatCardProps) => {
  const { count, ref } = useCountUp(value, 1200, delay);

  return (
    <div
      ref={ref}
      className="bg-card rounded-xl p-4 sm:p-5 border border-border flex items-center gap-3 sm:gap-4 animate-fade-in hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center`}
        style={{ backgroundColor: `hsl(var(${colorClass}) / 0.12)` }}
      >
        <Icon size={20} style={{ color: `hsl(var(${colorClass}))` }} />
      </div>
      <div className="min-w-0">
        <div className="text-xl sm:text-2xl font-bold text-card-foreground tabular-nums">
          {count.toLocaleString()}
        </div>
        <div className="text-[11px] sm:text-xs text-muted-foreground truncate">{label}</div>
        <div className={`text-[10px] sm:text-[11px] mt-0.5 font-medium ${changePositive ? "text-chart-good" : "text-stat-red"}`}>
          {change}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
