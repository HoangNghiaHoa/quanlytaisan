import { useState } from "react";
import { Eye, Pencil, Trash2, Plus, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Filter, Upload } from "lucide-react";
import { Equipment, useEquipment } from "@/contexts/EquipmentContext";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import EquipmentPanel from "./EquipmentPanel";
import ImportExcelModal from "./ImportExcelModal";

interface EquipmentTableProps {
  departmentId?: string;
}

// 1. Định nghĩa enum giống BE
export enum AssetStatus {
  USING = "Đang sử dụng",
  BROKEN = "Hỏng",
  IDLE = "Nhàn rỗi",
  LIQUIDATED = "Đã thanh lý",
}

// 2. Map enum sang style
export const statusStyles: Record<AssetStatus, string> = {
  [AssetStatus.USING]: "bg-chart-good/15 text-chart-good",
  [AssetStatus.BROKEN]: "bg-destructive/15 text-destructive",
  [AssetStatus.IDLE]: "bg-stat-blue/15 text-stat-blue",
  [AssetStatus.LIQUIDATED]: "bg-stat-gray/15 text-stat-gray",
};

// 3. Nếu BE có alias (ví dụ: "Đang dùng tốt"), FE normalize lại
export function normalizeStatus(label: string): AssetStatus {
  if (label.trim() === "Đang dùng tốt") return AssetStatus.USING;
  return label as AssetStatus;
}

const EquipmentTable = ({ departmentId }: EquipmentTableProps) => {
  const {equipmentData, filteredData, filters, setFilters, sortConfig, toggleSort, selectedRows, toggleSelectRow, selectAllPage, currentPage, setCurrentPage, rowsPerPage, deleteEquipment, deleteMultiple, getFilteredByDepartment } = useEquipment();
  const { toast } = useToast();

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"add" | "edit" | "view">("add");
  const [panelItemId, setPanelItemId] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // Sử dụng filteredData (là mảng 35 cái sau khi đã sửa API)
  const data = departmentId ? getFilteredByDepartment(departmentId) : filteredData;

  // Tổng số trang = 35 / 10 (rowsPerPage) = 4 trang
  const totalPages = Math.ceil(data.length / rowsPerPage); 

  const start = (currentPage - 1) * rowsPerPage;

  // Đây là dòng quan trọng để CHIA dữ liệu ra từng trang
  const pageData = data.slice(start, start + rowsPerPage);

  const allPageSelected = pageData.length > 0 && pageData.every((item) => selectedRows.has(item.id));
  
  const openPanel = (mode: "add" | "edit" | "view", id?: number) => {
    setPanelMode(mode);
    setPanelItemId(id ?? null);
    setPanelOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa công cụ này?")) {
      deleteEquipment(id);
      toast({ title: "Đã xóa thành công!" });
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size > 0 && confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.size} công cụ đã chọn?`)) {
      deleteMultiple(new Set(selectedRows));
      toast({ title: `Đã xóa ${selectedRows.size} mục!` });
    }
  };

  const sortableColumns: { key: keyof Equipment; label: string }[] = [
    { key: "id", label: "STT" },
    { key: "name", label: "Tên công cụ dụng cụ" },
    { key: "serial", label: "Serial" },
    { key: "quantity", label: "SL" },
    { key: "yearManufacture", label: "Năm SX" },
    { key: "yearUse", label: "Năm SD" },
  ];

  const SortIcon = ({ column }: { column: keyof Equipment }) => {
    if (sortConfig.column !== column) return <ArrowUpDown size={12} className="text-muted-foreground/50" />;
    return sortConfig.direction === "asc" ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />;
  };

  const paginationPages = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) startPage = Math.max(1, endPage - maxButtons + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* Action Bar */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {selectedRows.size === 0 ? "Chưa chọn mục nào" : `Đã chọn ${selectedRows.size} mục`}
        </span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openPanel("add")} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
            <Plus size={14} /> <span className="hidden sm:inline">Thêm</span>
          </button>
          <button onClick={() => setImportOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-chart-good text-primary-foreground rounded-md text-sm font-medium hover:bg-chart-good/90 transition-all">
            <Upload size={14} /> <span className="hidden sm:inline">Nhập Excel</span>
          </button>
          <button
            onClick={() => { if (selectedRows.size === 1) openPanel("edit", [...selectedRows][0]); }}
            disabled={selectedRows.size !== 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil size={14} /> <span className="hidden sm:inline">Sửa</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedRows.size === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} /> <span className="hidden sm:inline">Xóa</span>
          </button>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-md text-sm text-foreground hover:bg-secondary transition-all">
            <Filter size={14} /> Lọc
          </button>
          <button onClick={() => { exportToExcel(data, departmentId ? `Phong_ban_${departmentId}` : "Tat_ca_CCDC"); toast({ title: "✅ Xuất Excel thành công!", description: `Đã xuất ${data.length} thiết bị.` }); }} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
            <FileSpreadsheet size={14} /> <span className="hidden sm:inline">Excel</span>
          </button>
          <button onClick={() => { exportToPDF(data, departmentId || "Tat ca"); toast({ title: "✅ Xuất PDF thành công!", description: `Đã xuất báo cáo ${data.length} thiết bị.` }); }} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-md text-sm text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-all">
            <FileText size={14} /> <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="sm:hidden bg-card rounded-lg border border-border p-4 mb-4 space-y-3">
          <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} className="w-full p-2.5 border border-border rounded-md text-sm bg-card text-foreground">
            <option value="">Tất cả hiện trạng</option>
            <option value="Đang dùng tốt">Đang dùng tốt</option>
            <option value="Cần sửa chữa">Cần sửa chữa</option>
            <option value="Hỏng">Hỏng</option>
          </select>
          <select value={filters.demand} onChange={(e) => setFilters({ demand: e.target.value })} className="w-full p-2.5 border border-border rounded-md text-sm bg-card text-foreground">
            <option value="">Nhu cầu sử dụng</option>
            <option value="Thường xuyên">Thường xuyên</option>
            <option value="Theo đợt">Theo đợt</option>
            <option value="Cần bổ sung">Cần bổ sung</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)]">
          <table className="w-full text-[13px] border-collapse">
            <thead className="sticky top-0 z-10 bg-secondary">
              <tr>
                <th className="w-10 text-center px-3 py-3.5 border-b-2 border-border">
                  <input type="checkbox" checked={allPageSelected} onChange={(e) => selectAllPage(e.target.checked)} className="w-4 h-4 cursor-pointer accent-primary" />
                </th>
                {sortableColumns.map((col) => (
                  <th key={col.key} onClick={() => toggleSort(col.key)} className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{col.label} <SortIcon column={col.key} /></span>
                  </th>
                ))}
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">ĐVT</th>
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Nước SX</th>
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Hãng SX</th>
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Hiện trạng</th>
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Nhu cầu SD</th>
                <th className="text-left px-3 py-3.5 border-b-2 border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap w-[100px]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-10 text-muted-foreground">
                    <div className="text-4xl mb-3">📭</div>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                pageData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border/50 transition-colors cursor-pointer hover:bg-secondary/50 ${selectedRows.has(item.id) ? "bg-primary/5" : ""}`}
                    onDoubleClick={() => openPanel("view", item.id)}
                  >
                    <td className="text-center px-3 py-3.5">
                      <input type="checkbox" checked={selectedRows.has(item.id)} onChange={() => toggleSelectRow(item.id)} className="w-4 h-4 cursor-pointer accent-primary" />
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground">{start + index + 1}</td>
                    <td className="px-3 py-3.5 text-foreground font-medium whitespace-nowrap">{item.name}</td>
                    <td className="px-3 py-3.5 font-semibold text-foreground whitespace-nowrap">{item.serial}</td>
                    <td className="px-3 py-3.5">{item.quantity}</td>
                    <td className="px-3 py-3.5">{item.yearManufacture || "-"}</td>
                    <td className="px-3 py-3.5">{item.yearUse || "-"}</td>
                    <td className="px-3 py-3.5">{item.unit}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap">{item.country || "-"}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap">{item.brand || "-"}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${statusStyles[item.status] || "bg-secondary text-muted-foreground"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">{item.demand || "-"}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openPanel("view", item.id)} className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openPanel("edit", item.id)} className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-stat-orange/10 text-muted-foreground hover:text-stat-orange transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-5 py-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-[13px] text-muted-foreground">
            Hiển thị {data.length > 0 ? start + 1 : 0}-{Math.min(start + rowsPerPage, data.length)} trong tổng số {data.length} bản ghi
          </span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1.5 border border-border rounded text-sm bg-card hover:bg-secondary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            {paginationPages().map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 border rounded text-sm transition-all ${page === currentPage ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-secondary hover:border-primary"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1.5 border border-border rounded text-sm bg-card hover:bg-secondary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <EquipmentPanel open={panelOpen} onClose={() => setPanelOpen(false)} mode={panelMode} itemId={panelItemId} />
      <ImportExcelModal open={importOpen} onClose={() => setImportOpen(false)} departmentId={departmentId} />
    </>
  );
};

export default EquipmentTable;
