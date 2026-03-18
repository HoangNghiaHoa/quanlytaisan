import { Database, CheckCircle, AlertTriangle, Wrench, Search, Bell, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEquipment } from "@/contexts/EquipmentContext";
import ApiStatusGuard from "@/components/ApiStatusGuard";
import { useAuth } from "@/contexts/AuthContext";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import DepartmentChart from "@/components/DepartmentChart";
import StatusDonut from "@/components/StatusDonut";
import RecentActivity from "@/components/RecentActivity";
import { useMemo } from "react";

const Index = () => {
  const { toast } = useToast();
  const { equipmentData } = useEquipment();
  const { isAdmin, currentUser, canAccessDepartment } = useAuth();

 const visibleData = isAdmin
  ? equipmentData
  : equipmentData.filter((e) => canAccessDepartment(Number(e.departmentId)));

  const kpis = useMemo(() => {
    const data = visibleData;
    return {
      total: data.length,
      // Sửa "Đang dùng tốt" -> "Đang sử dụng"
      active: data.filter((e) => e.status === "Đang sử dụng").length,
      // Sửa "Cần sửa chữa" -> "Nhàn rỗi" (hoặc "Đang sửa chữa" tùy em muốn hiện số nào lên card)
      repair: data.filter((e) => e.status === "Nhàn rỗi").length, 
      broken: data.filter((e) => e.status === "Hỏng").length,
    };
  }, [visibleData]);


  const handleExportExcel = () => {
    exportToExcel(visibleData, "Dashboard_Tong_hop");
    toast({ title: "✅ Xuất Excel thành công!", description: `Đã xuất ${visibleData.length} thiết bị.` });
  };

  const handleExportPDF = () => {
    exportToPDF(visibleData, "Dashboard Tong hop");
    toast({ title: "✅ Xuất PDF thành công!", description: `Đã xuất báo cáo ${visibleData.length} thiết bị.` });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <ApiStatusGuard>
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-card border-b border-border">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="text-xl">📊</span> Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm tên CCDC, serial number..."
                className="pl-9 pr-4 py-2 text-sm rounded-lg bg-secondary border-0 text-foreground placeholder:text-muted-foreground w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button onClick={handleExportExcel} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all" title="Xuất Excel">
              <FileSpreadsheet size={16} /> <span className="hidden lg:inline">Excel</span>
            </button>
            <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all" title="Xuất PDF">
              <FileText size={16} /> <span className="hidden lg:inline">PDF</span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-stat-red rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
           <StatCard icon={Database} value={kpis.total} label="Tổng số CCDC" change={isAdmin ? "Toàn hệ thống" : `${currentUser?.departments.length || 0} phòng ban`} changePositive={true} colorClass="--stat-red" delay={0} />
           <StatCard icon={CheckCircle} value={kpis.active} label="Đang sử dụng" change={kpis.total > 0 ? `${((kpis.active / kpis.total) * 100).toFixed(1)}%` : "0%"} changePositive={true} colorClass="--stat-green" delay={100} />
           <StatCard icon={Wrench} value={kpis.repair} label="Nhàn rỗi" change={kpis.total > 0 ? `${((kpis.repair / kpis.total) * 100).toFixed(1)}%` : "0%"} changePositive={false} colorClass="--stat-orange" delay={200} />
           <StatCard icon={AlertTriangle} value={kpis.broken} label="Hỏng" change={kpis.total > 0 ? `${((kpis.broken / kpis.total) * 100).toFixed(1)}%` : "0%"} changePositive={false} colorClass="--stat-purple" delay={300} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3"><DepartmentChart /></div>
            <div className="lg:col-span-2"><StatusDonut /></div>
          </div>

          {/* Warning Banner */}
          <div className="bg-stat-orange/10 border border-stat-orange/30 rounded-xl px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-stat-orange shrink-0" />
              <span className="text-sm text-foreground">
                <strong>Lưu ý:</strong> Có <strong>{kpis.broken}</strong> công cụ đang ở trạng thái <strong>Hỏng</strong> – cần xem xét sửa chữa hoặc thanh lý.
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
        </ApiStatusGuard>
      </main>
    </div>
  );
};

export default Index;
