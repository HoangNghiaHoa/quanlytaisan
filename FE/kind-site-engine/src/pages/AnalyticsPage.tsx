import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { useEquipment } from "@/contexts/EquipmentContext";
import ApiStatusGuard from "@/components/ApiStatusGuard";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

const STATUS_COLORS: Record<string, string> = {
  "Đang sử dụng": "hsl(142, 70%, 45%)", // Đổi từ "Đang dùng tốt" thành "Đang sử dụng"
  "Đang sửa chữa": "hsl(32, 95%, 55%)", // Khớp với REPAIRING("Đang sửa chữa")
  "Hỏng": "hsl(0, 65%, 55%)",
  "Nhàn rỗi": "hsl(236, 66%, 45%)",
};

const BAR_COLORS = [
  "hsl(220, 70%, 50%)", "hsl(0, 65%, 55%)", "hsl(142, 70%, 45%)", "hsl(32, 95%, 55%)",
  "hsl(270, 60%, 55%)", "hsl(45, 90%, 50%)", "hsl(180, 60%, 40%)", "hsl(330, 60%, 50%)",
];

const AnalyticsPage = () => {
  const { departments, equipmentData, calculateKPIs } = useEquipment();
  const { toast } = useToast();

  const globalKPIs = calculateKPIs();

  // Pie chart data by status
  const statusCounts = equipmentData.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || "hsl(220, 10%, 70%)" }));
  const totalPie = pieData.reduce((s, d) => s + d.value, 0);

  // Bar chart data by department
  const barData = departments.map((d) => {
    const kpis = calculateKPIs(String(d.id));
    return { 
      name: d.shortName || d.name, 
      total: kpis.total, 
      active: kpis.active, // Đây là số lượng "Đang sử dụng"
      broken: kpis.broken  // Đây là số lượng "Hỏng"
    };
  });

  // Summary table
  const summaryData = departments.map((d) => {
    const kpis = calculateKPIs(String(d.id));
    return { 
      id: d.id,
      name: d.name,
      total: kpis.total,
      active: kpis.active,
      idle: kpis.idle,
      broken: kpis.broken,
      need: kpis.need
    };
  });

  const handleExportExcel = () => {
    exportToExcel(equipmentData, "Tong_hop_CCDC");
    toast({ title: "✅ Xuất Excel thành công!", description: `Đã xuất ${equipmentData.length} thiết bị.` });
  };

  const handleExportPDF = () => {
    exportToPDF(equipmentData, "Tong hop");
    toast({ title: "✅ Xuất PDF thành công!", description: `Đã xuất báo cáo ${equipmentData.length} thiết bị.` });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <ApiStatusGuard>
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" /> Báo cáo tổng hợp
          </h1>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
              <FileSpreadsheet size={14} /> <span className="hidden sm:inline">Xuất Excel</span>
            </button>
            <button onClick={handleExportPDF} className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
              <FileText size={14} /> <span className="hidden sm:inline">Xuất PDF</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6">
          {/* KPI Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tổng thiết bị", value: globalKPIs.total, color: "text-primary" },
              { label: "Đang sử dụng", value: globalKPIs.active, color: "text-chart-good" }, // Sửa nhãn
              { label: "Đang sửa chữa", value: globalKPIs.idle, color: "text-stat-orange" }, // Sửa nhãn
              { label: "Hỏng", value: globalKPIs.broken, color: "text-destructive" },
            ].map((k) => (
              <div key={k.label} className="bg-card rounded-xl border border-border p-4 text-center">
                <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">📊 Tỷ lệ theo tình trạng</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-48 h-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0} cornerRadius={4}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} (${((value / totalPie) * 100).toFixed(1)}%)`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{totalPie}</span>
                    <span className="text-[11px] text-muted-foreground">Tổng số</span>
                  </div>
                </div>
                <div className="space-y-3 w-full">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 hover:bg-secondary/50 rounded-lg px-2 py-1 -mx-2 transition-colors">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                      <span className="text-xs font-bold text-foreground">{item.value}</span>
                      <span className="text-[10px] text-muted-foreground w-10 text-right">{((item.value / totalPie) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">📈 Phân bổ theo phòng ban</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                    {/* dataKey="total" -> lấy từ kpis.total */}
                      <Bar dataKey="total" name="Tổng số" fill="hsl(220, 70%, 50%)" />
                      
                      {/* dataKey="active" -> lấy từ kpis.active (chính là số "Đang sử dụng" mình vừa sửa ở trên) */}
                      <Bar dataKey="active" name="Đang sử dụng" fill="hsl(142, 70%, 45%)" />
                      
                      {/* dataKey="broken" -> lấy từ kpis.broken */}
                      <Bar dataKey="broken" name="Hỏng" fill="hsl(0, 65%, 55%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">📋 Bảng tổng hợp theo phòng ban</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Phòng ban</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tổng CCDC</th>
                     <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Đang dùng tốt</th>
                     <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Nhàn rỗi</th>
                     <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Hỏng</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Cần bổ sung</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tỷ lệ SD</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={row.id} className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-center font-bold text-foreground">{row.total}</td>
                      <td className="px-4 py-3 text-center text-chart-good font-semibold">{row.active}</td>
                      <td className="px-4 py-3 text-center text-stat-orange font-semibold">{row.idle}</td>
                      <td className="px-4 py-3 text-center text-destructive font-semibold">{row.broken}</td>
                      <td className="px-4 py-3 text-center text-primary font-semibold">{row.need}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-chart-good/15 text-chart-good">
                          {row.total > 0 ? ((row.active / row.total) * 100).toFixed(0) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-primary/5 font-bold">
                    <td className="px-4 py-3 text-foreground">TỔNG CỘNG</td>
                    <td className="px-4 py-3 text-center text-foreground">{globalKPIs.total}</td>
                    <td className="px-4 py-3 text-center text-chart-good">{globalKPIs.active}</td>
                    <td className="px-4 py-3 text-center text-stat-orange">{globalKPIs.idle}</td>
                    <td className="px-4 py-3 text-center text-destructive">{globalKPIs.broken}</td>
                    <td className="px-4 py-3 text-center text-primary">{globalKPIs.need}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-chart-good/15 text-chart-good">
                        {globalKPIs.total > 0 ? ((globalKPIs.active / globalKPIs.total) * 100).toFixed(0) : 0}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </ApiStatusGuard>
      </main>
    </div>
  );
};

export default AnalyticsPage;
