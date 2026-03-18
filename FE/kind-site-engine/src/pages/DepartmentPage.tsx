import { useParams } from "react-router-dom";
import { Package, CheckCircle, PauseCircle, AlertTriangle, PlusCircle, Search } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import EquipmentTable from "@/components/EquipmentTable";
import ApiStatusGuard from "@/components/ApiStatusGuard";
import StatCard from "@/components/StatCard";
import { useEquipment } from "@/contexts/EquipmentContext";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, FileText as FileTextIcon } from "lucide-react";

const DepartmentPage = () => {
  const { id } = useParams<{ id: string }>();
  // Thêm isLoading vào đây
  const { calculateKPIs, filters, setFilters, departments, getFilteredByDepartment, isLoading } = useEquipment();
  const { toast } = useToast();

// 1. Kiểm tra nếu đang tải thì hiện loading, tránh hiện lỗi "Không tìm thấy" oan
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải dữ liệu...</div>;
  }

  // 2. Ép kiểu khi tìm kiếm
  const department = departments.find((d) => String(d.id) === String(id));
  const kpis = calculateKPIs(id);

  if (!department) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy phòng ban</h2>
            <p className="text-muted-foreground">Phòng ban với mã "{id}" không tồn tại.</p>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <ApiStatusGuard>
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-base font-bold text-foreground flex items-center gap-2">
              🏢 {department.name}
            </h1>
            <div className="relative flex-1 max-w-[400px] hidden sm:block ml-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Tìm kiếm thiết bị..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { const data = getFilteredByDepartment(id!); exportToExcel(data, department.name); toast({ title: "✅ Xuất Excel thành công!" }); }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
              <FileSpreadsheet size={14} /> <span className="hidden sm:inline">Excel</span>
            </button>
            <button onClick={() => { const data = getFilteredByDepartment(id!); exportToPDF(data, department.name); toast({ title: "✅ Xuất PDF thành công!" }); }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
              <FileTextIcon size={14} /> <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard icon={Package} value={kpis.total} label="Tổng số" change={`Phòng ${department.shortName}`} changePositive colorClass="--primary" delay={0} />
           <StatCard icon={CheckCircle} value={kpis.active} label="Đang sử dụng" change={kpis.total > 0 ? `${((kpis.active/kpis.total)*100).toFixed(0)}%` : "0%"} changePositive colorClass="--stat-green" delay={100} />
            <StatCard icon={PauseCircle} value={kpis.idle} label="Đang sửa chữa" change={kpis.total > 0 ? `${((kpis.idle/kpis.total)*100).toFixed(0)}%` : "0%"} changePositive={false} colorClass="--stat-orange" delay={200} />
            <StatCard icon={AlertTriangle} value={kpis.broken} label="Hỏng / Không SD" change={kpis.total > 0 ? `${((kpis.broken/kpis.total)*100).toFixed(0)}%` : "0%"} changePositive={false} colorClass="--stat-red" delay={300} />
            <StatCard icon={PlusCircle} value={kpis.need} label="Cần bổ sung" change="Yêu cầu mới" changePositive colorClass="--stat-blue" delay={400} />
          </div>

          <EquipmentTable departmentId={id} />
        </div>
        </ApiStatusGuard>
      </main>
    </div>
  );
};

export default DepartmentPage;
