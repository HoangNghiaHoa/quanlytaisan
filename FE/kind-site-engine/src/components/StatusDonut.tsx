import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEquipment } from "@/contexts/EquipmentContext";

const STATUS_COLORS: Record<string, string> = {
  "Đang sử dụng": "hsl(142, 70%, 45%)", // Đổi từ "Đang dùng tốt" thành "Đang sử dụng"
  "Đang sửa chữa": "hsl(32, 95%, 55%)", // Khớp với REPAIRING("Đang sửa chữa")
  "Hỏng": "hsl(0, 65%, 55%)",
  "Nhàn rỗi": "hsl(236, 66%, 45%)",
};

const StatusDonut = () => {
  const { equipmentData } = useEquipment();

  const statusCounts = equipmentData.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name] || "hsl(220, 10%, 70%)",
  }));

  const total = data.reduce((s, d) => s + d.value, 0);
  const activeCount = statusCounts["Đang sử dụng"] || 0; 
  const activePercent = total > 0 ? ((activeCount / total) * 100).toFixed(0) : "0";
  return (
    <div className="bg-card rounded-xl p-5 border border-border h-full">
      <h3 className="font-semibold text-card-foreground mb-4">Hiện trạng CCDC</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0} cornerRadius={4}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-card-foreground">{activePercent}%</span>
            <span className="text-[11px] text-muted-foreground font-medium">Tốt</span>
          </div>
        </div>
        <div className="space-y-3 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 group cursor-default hover:bg-secondary/50 rounded-lg px-2 py-1 -mx-2 transition-colors">
              <span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-1 ring-transparent group-hover:ring-current transition-all" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
              <span className="text-xs font-bold text-card-foreground">{item.value}</span>
              <span className="text-[10px] text-muted-foreground w-8 text-right">
                {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDonut;
