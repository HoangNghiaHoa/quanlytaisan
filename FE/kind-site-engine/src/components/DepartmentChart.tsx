import { useEquipment } from "@/contexts/EquipmentContext";

const barColors = [
  "bg-bar-red", "bg-bar-purple", "bg-bar-green", "bg-bar-yellow",
  "bg-bar-black", "bg-bar-red-light", "bg-bar-purple-light", "bg-bar-green-dark", "bg-bar-yellow-dark",
];

const DepartmentChart = () => {
  const { departments, calculateKPIs } = useEquipment();

  const deptData = departments.map((d, i) => ({
    name: d.name,
    value: calculateKPIs(String(d.id)).total,
    color: barColors[i % barColors.length],
  }));

  const maxValue = Math.max(...deptData.map((d) => d.value), 1);

  return (
    <div className="bg-card rounded-xl p-5 border border-border h-full">
      <h3 className="font-semibold text-card-foreground mb-4">📊 Phân bổ theo Phòng ban</h3>
      <div className="space-y-2.5">
        {deptData.map((dept, i) => (
          <div key={dept.name} className="group flex items-center gap-3 hover:bg-secondary/50 rounded-lg px-2 py-0.5 -mx-2 transition-colors cursor-default">
            <div className="w-28 sm:w-36 text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">{dept.name}</div>
            <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${dept.color} rounded-full transition-all duration-700`}
                style={{ width: `${(dept.value / maxValue) * 100}%`, animationDelay: `${i * 80}ms` }}
              />
            </div>
            <span className="text-xs font-medium text-card-foreground w-6 text-right">{dept.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentChart;
