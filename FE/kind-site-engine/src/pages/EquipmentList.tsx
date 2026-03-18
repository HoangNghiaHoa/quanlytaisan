import { Search, Bell, RefreshCw, Wrench } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import EquipmentTable from "@/components/EquipmentTable";
import { useEquipment } from "@/contexts/EquipmentContext";
import ApiStatusGuard from "@/components/ApiStatusGuard";
import StatCard from "@/components/StatCard";
import { Package, CheckCircle, PauseCircle, AlertTriangle, PlusCircle } from "lucide-react";

const EquipmentList = () => {
  const { filters, setFilters, calculateKPIs } = useEquipment();
  const kpis = calculateKPIs();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <ApiStatusGuard>
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-3">
              <Wrench size={20} className="text-primary" />
              <span className="font-semibold text-foreground text-base hidden sm:inline">HỆ THỐNG QUẢN LÝ CÔNG CỤ - DỤNG CỤ</span>
              <span className="font-semibold text-foreground text-base sm:hidden">QLCC</span>
            </div>
            <div className="relative flex-1 max-w-[500px] hidden sm:block ml-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all"
              />
            </div>
            <div className="hidden lg:flex gap-3 ml-3">
              <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} className="px-3 py-2 border border-border rounded-md text-[13px] bg-card cursor-pointer hover:border-primary transition-colors">
                <option value="">Tất cả hiện trạng</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Nhàn rỗi">Nhàn rỗi</option>
                <option value="Hỏng">Hỏng</option>
                <option value="Không sử dụng">Không sử dụng</option>
              </select>
              <select value={filters.demand} onChange={(e) => setFilters({ demand: e.target.value })} className="px-3 py-2 border border-border rounded-md text-[13px] bg-card cursor-pointer hover:border-primary transition-colors">
                <option value="">Nhu cầu sử dụng</option>
                <option value="Thường xuyên">Thường xuyên</option>
                <option value="Theo đợt">Theo đợt</option>
                <option value="Cần bổ sung">Cần bổ sung</option>
              </select>
              <select value={filters.year} onChange={(e) => setFilters({ year: e.target.value })} className="px-3 py-2 border border-border rounded-md text-[13px] bg-card cursor-pointer hover:border-primary transition-colors">
                <option value="">Năm sử dụng</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="older">Trước 2021</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-semibold px-1.5 py-0.5 leading-none">3</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard icon={Package} value={kpis.total} label="Tổng số công cụ" change="Tất cả thiết bị" changePositive colorClass="--primary" delay={0} />
            <StatCard icon={CheckCircle} value={kpis.active} label="Đang sử dụng" change={`${((kpis.active/kpis.total)*100).toFixed(1)}% tổng số`} changePositive colorClass="--stat-green" delay={100} />
            <StatCard icon={PauseCircle} value={kpis.idle} label="Nhàn rỗi" change={`${((kpis.idle/kpis.total)*100).toFixed(1)}% tổng số`} changePositive={false} colorClass="--stat-orange" delay={200} />
            <StatCard icon={AlertTriangle} value={kpis.broken} label="Hỏng / Không SD" change={`${((kpis.broken/kpis.total)*100).toFixed(1)}% cần xử lý`} changePositive={false} colorClass="--stat-red" delay={300} />
            <StatCard icon={PlusCircle} value={kpis.need} label="Cần bổ sung" change="Yêu cầu mua sắm" changePositive colorClass="--stat-blue" delay={400} />
          </div>

          <EquipmentTable />
        </div>
        </ApiStatusGuard>
      </main>
    </div>
  );
};

export default EquipmentList;
