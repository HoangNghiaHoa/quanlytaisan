import { useState, useRef, useCallback } from "react";
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, FileWarning, RefreshCw, SkipForward } from "lucide-react";
import * as XLSX from "xlsx";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useToast } from "@/hooks/use-toast";
import type { Equipment } from "@/contexts/EquipmentContext";

interface ImportExcelModalProps {
  open: boolean;
  onClose: () => void;
  departmentId?: string;
}

type DuplicateAction = "overwrite" | "skip";

interface ParsedRow {
  name: string;
  serial: string;
  quantity: number;
  unit: string;
  yearManufacture: number | null;
  yearUse: number | null;
  country: string;
  brand: string;
  model: string;
  capacity: string;
  status: string;
  demand: string;
  note: string;
  departmentId: string;
  departmentName: string;
  _error?: string;
  _duplicateId?: number; // ID of existing equipment with same serial
}

const REQUIRED_COLS = ["Tên CCDC", "Serial"];
const VALID_STATUSES = ["Đang dùng tốt", "Cần sửa chữa", "Hỏng"];
const VALID_DEMANDS = ["Thường xuyên", "Theo đợt", "Cần bổ sung", "Dự phòng"];

const TEMPLATE_COLS = [
  "Tên CCDC", "Serial", "Số lượng", "ĐVT", "Năm SX", "Năm SD",
  "Nước SX", "Hãng SX", "Model", "Công suất",
  "Hiện trạng", "Nhu cầu SD", "Phòng ban", "Ghi chú",
];

const ImportExcelModal = ({ open, onClose, departmentId }: ImportExcelModalProps) => {
  const { departments, equipmentData, bulkAddEquipment, updateEquipment } = useEquipment();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [duplicateAction, setDuplicateAction] = useState<DuplicateAction>("skip");

  const reset = () => {
    setStep("upload");
    setFileName("");
    setParsedData([]);
    setErrors([]);
    setIsDragging(false);
    setDuplicateAction("skip");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const downloadTemplate = () => {
    const sampleData = [
      {
        "Tên CCDC": "Máy tính để bàn Dell",
        "Serial": "DELL-2024-001",
        "Số lượng": 2,
        "ĐVT": "Bộ",
        "Năm SX": 2023,
        "Năm SD": 2024,
        "Nước SX": "Mỹ",
        "Hãng SX": "Dell",
        "Model": "OptiPlex 7010",
        "Công suất": "-",
        "Hiện trạng": "Đang dùng tốt",
        "Nhu cầu SD": "Thường xuyên",
        "Phòng ban": departments[0]?.name || "Kế toán - Tổng hợp",
        "Ghi chú": "Máy mới mua",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData, { header: TEMPLATE_COLS });
    // Auto-fit column widths
    ws["!cols"] = TEMPLATE_COLS.map((h) => ({ wch: Math.max(h.length + 2, 18) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mau_nhap_CCDC");
    XLSX.writeFile(wb, "Mau_nhap_CCDC.xlsx");
    toast({ title: "📥 Đã tải file mẫu" });
  };

  const parseFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

          if (jsonData.length === 0) {
            setErrors(["File không có dữ liệu."]);
            return;
          }

          // Check required columns
          const headers = Object.keys(jsonData[0]);
          const missingCols = REQUIRED_COLS.filter((c) => !headers.includes(c));
          if (missingCols.length > 0) {
            setErrors([`Thiếu các cột bắt buộc: ${missingCols.join(", ")}. Hãy tải file mẫu để biết cấu trúc đúng.`]);
            return;
          }

          // Build serial lookup from existing data
          const existingSerialMap = new Map<string, number>();
          equipmentData.forEach((eq) => {
            if (eq.serial) existingSerialMap.set(eq.serial.toLowerCase(), eq.id);
          });

          const errs: string[] = [];
          const rows: ParsedRow[] = jsonData.map((row, idx) => {
            const rowNum = idx + 2;
            const name = String(row["Tên CCDC"] || "").trim();
            const serial = String(row["Serial"] || "").trim();

            if (!name) errs.push(`Dòng ${rowNum}: Thiếu "Tên CCDC"`);
            if (!serial) errs.push(`Dòng ${rowNum}: Thiếu "Serial"`);

            // Check duplicate serial
            const duplicateId = serial ? existingSerialMap.get(serial.toLowerCase()) : undefined;
            if (duplicateId) {
              errs.push(`Dòng ${rowNum}: Serial "${serial}" đã tồn tại trong hệ thống`);
            }

            // Resolve department
            const deptNameRaw = String(row["Phòng ban"] || "").trim();
            let resolvedDept = departmentId
              ? departments.find((d) => Number(d.id) === Number(departmentId)) // Ép cả 2 về number để so sánh
              : departments.find((d) => 
                  d.name === deptNameRaw || 
                  d.shortName === deptNameRaw ||
                  String(d.id) === deptNameRaw // Đề phòng trường hợp trong Excel nhập ID thay vì tên
                );

            if (!resolvedDept && !departmentId) {
              if (deptNameRaw) {
                errs.push(`Dòng ${rowNum}: Phòng ban "${deptNameRaw}" không tồn tại → gán vào phòng đầu tiên`);
              }
              resolvedDept = departments[0];
            }

            // Validate status
            let status = String(row["Hiện trạng"] || "Đang dùng tốt").trim();
            if (!VALID_STATUSES.includes(status)) {
              errs.push(`Dòng ${rowNum}: Hiện trạng "${status}" không hợp lệ → đặt "Đang dùng tốt"`);
              status = "Đang dùng tốt";
            }

            let demand = String(row["Nhu cầu SD"] || "Thường xuyên").trim();
            if (!VALID_DEMANDS.includes(demand)) {
              demand = "Thường xuyên";
            }

            return {
              name,
              serial,
              quantity: parseInt(row["Số lượng"]) || 1,
              unit: String(row["ĐVT"] || "Cái").trim(),
              yearManufacture: parseInt(row["Năm SX"]) || null,
              yearUse: parseInt(row["Năm SD"]) || null,
              country: String(row["Nước SX"] || "").trim(),
              brand: String(row["Hãng SX"] || "").trim(),
              model: String(row["Model"] || "").trim(),
              capacity: String(row["Công suất"] || "-").trim(),
              status,
              demand,
              note: String(row["Ghi chú"] || "").trim(),
              departmentId: String(resolvedDept?.id || departments[0]?.id || ""),
              departmentName: resolvedDept?.name || departments[0]?.name || "",
              _error: !name || !serial ? "Thiếu thông tin bắt buộc" : undefined,
              _duplicateId: duplicateId,
            };
          });

          setErrors(errs);
          setParsedData(rows);
          setStep("preview");
        } catch {
          setErrors(["Không thể đọc file. Vui lòng kiểm tra định dạng file (.xlsx, .xls)."]);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [departments, departmentId, equipmentData]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleConfirmImport = () => {
    const rowsWithoutError = parsedData.filter((r) => !r._error);
    if (rowsWithoutError.length === 0) {
      toast({ title: "❌ Không có dữ liệu hợp lệ để nhập", variant: "destructive" });
      return;
    }

    const newRows = rowsWithoutError.filter((r) => !r._duplicateId);
    const duplicateRows = rowsWithoutError.filter((r) => r._duplicateId);

    const toData = (r: ParsedRow) => ({
      name: r.name, serial: r.serial, quantity: r.quantity, unit: r.unit,
      yearManufacture: r.yearManufacture, yearUse: r.yearUse, country: r.country,
      brand: r.brand, model: r.model, capacity: r.capacity, status: r.status,
      demand: r.demand, note: r.note, departmentId: r.departmentId, departmentName: r.departmentName,
    });

    // Add new items
    if (newRows.length > 0) {
      bulkAddEquipment(newRows.map(toData));
    }

    // Handle duplicates
    let overwrittenCount = 0;
    let skippedCount = 0;
    if (duplicateAction === "overwrite") {
      duplicateRows.forEach((r) => {
        if (r._duplicateId) {
          updateEquipment(r._duplicateId, toData(r));
          overwrittenCount++;
        }
      });
    } else {
      skippedCount = duplicateRows.length;
    }

    const parts: string[] = [];
    if (newRows.length > 0) parts.push(`${newRows.length} mới`);
    if (overwrittenCount > 0) parts.push(`${overwrittenCount} ghi đè`);
    if (skippedCount > 0) parts.push(`${skippedCount} bỏ qua (trùng)`);

    toast({
      title: `✅ Đã nhập thành công ${newRows.length + overwrittenCount} thiết bị`,
      description: parts.join(", "),
    });
    handleClose();
  };

  const validCount = parsedData.filter((r) => !r._error).length;
  const errorCount = parsedData.filter((r) => r._error).length;
  const duplicateCount = parsedData.filter((r) => r._duplicateId && !r._error).length;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div
          className="bg-card rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Nhập dữ liệu từ Excel</h2>
                <p className="text-xs text-muted-foreground">
                  {step === "upload" ? "Chọn hoặc kéo thả file .xlsx, .xls" : `Xem trước ${parsedData.length} dòng từ "${fileName}"`}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-6">
            {step === "upload" && (
              <div className="space-y-5">
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                    isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet size={32} className="text-primary" />
                  </div>
                  <p className="text-foreground font-medium mb-1">
                    {isDragging ? "Thả file vào đây..." : "Kéo thả file Excel vào đây"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">hoặc nhấn để chọn file từ máy tính</p>
                  <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    Chọn file
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Template download */}
                <button
                  onClick={downloadTemplate}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-secondary/50 hover:border-primary/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-chart-good/10 flex items-center justify-center group-hover:bg-chart-good/20 transition-colors">
                    <Download size={18} className="text-chart-good" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium text-foreground">Tải file mẫu (Template)</div>
                    <div className="text-xs text-muted-foreground">Tải xuống file Excel mẫu với đúng cấu trúc cột cần thiết</div>
                  </div>
                </button>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                      <AlertCircle size={16} /> Lỗi khi đọc file
                    </div>
                    {errors.map((err, i) => (
                      <p key={i} className="text-xs text-destructive/80 pl-6">{err}</p>
                    ))}
                  </div>
                )}

                {/* Format info */}
                <div className="bg-secondary/50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">📋 Cấu trúc file cần có:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_COLS.map((col) => (
                      <span
                        key={col}
                        className={`text-[11px] px-2 py-0.5 rounded-md ${
                          REQUIRED_COLS.includes(col)
                            ? "bg-primary/15 text-primary font-semibold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {col}{REQUIRED_COLS.includes(col) ? " *" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex gap-3 flex-wrap items-center">
                  <div className="flex items-center gap-2 px-3 py-2 bg-chart-good/10 rounded-lg">
                    <CheckCircle2 size={16} className="text-chart-good" />
                    <span className="text-sm font-medium text-chart-good">{validCount} hợp lệ</span>
                  </div>
                  {duplicateCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                      <RefreshCw size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">{duplicateCount} trùng Serial</span>
                    </div>
                  )}
                  {errorCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg">
                      <FileWarning size={16} className="text-destructive" />
                      <span className="text-sm font-medium text-destructive">{errorCount} lỗi</span>
                    </div>
                  )}
                  {errors.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-stat-orange/10 rounded-lg">
                      <AlertCircle size={16} className="text-stat-orange" />
                      <span className="text-sm font-medium text-stat-orange">{errors.length} cảnh báo</span>
                    </div>
                  )}
                </div>

                {/* Duplicate action selector */}
                {duplicateCount > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <span className="text-xs font-medium text-foreground">Xử lý {duplicateCount} Serial trùng:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDuplicateAction("skip")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          duplicateAction === "skip"
                            ? "bg-secondary text-foreground ring-2 ring-primary/30"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <SkipForward size={13} /> Bỏ qua
                      </button>
                      <button
                        onClick={() => setDuplicateAction("overwrite")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          duplicateAction === "overwrite"
                            ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <RefreshCw size={13} /> Ghi đè
                      </button>
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {errors.length > 0 && (
                  <details className="bg-stat-orange/5 border border-stat-orange/20 rounded-lg p-3">
                    <summary className="text-xs font-medium text-stat-orange cursor-pointer">Xem {errors.length} cảnh báo</summary>
                    <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                      {errors.map((err, i) => (
                        <p key={i} className="text-[11px] text-stat-orange/80">{err}</p>
                      ))}
                    </div>
                  </details>
                )}

                {/* Preview Table */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[340px]">
                    <table className="w-full text-[12px] border-collapse">
                      <thead className="sticky top-0 bg-secondary z-10">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">#</th>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">Tên CCDC</th>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">Serial</th>
                          <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase">SL</th>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">Phòng ban</th>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">Hiện trạng</th>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.map((row, i) => (
                          <tr
                            key={i}
                            className={`border-b border-border/50 ${row._error ? "bg-destructive/5" : row._duplicateId ? "bg-primary/5" : i % 2 === 0 ? "" : "bg-secondary/20"}`}
                          >
                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                            <td className="px-3 py-2 text-foreground font-medium whitespace-nowrap max-w-[200px] truncate">{row.name || <span className="text-destructive italic">Trống</span>}</td>
                            <td className="px-3 py-2 text-foreground whitespace-nowrap">
                              {row.serial || <span className="text-destructive italic">Trống</span>}
                              {row._duplicateId && <span className="ml-1 text-[9px] text-primary font-semibold">⚠ TRÙNG</span>}
                            </td>
                            <td className="px-3 py-2 text-center">{row.quantity}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{row.departmentName}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                row.status === "Đang dùng tốt" ? "bg-chart-good/15 text-chart-good" :
                                row.status === "Cần sửa chữa" ? "bg-stat-orange/15 text-stat-orange" :
                                "bg-destructive/15 text-destructive"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              {row._error ? (
                                <span className="text-[10px] text-destructive font-medium">❌ {row._error}</span>
                              ) : row._duplicateId ? (
                                <span className={`text-[10px] font-medium ${duplicateAction === "overwrite" ? "text-primary" : "text-muted-foreground"}`}>
                                  {duplicateAction === "overwrite" ? "🔄 Ghi đè" : "⏭ Bỏ qua"}
                                </span>
                              ) : (
                                <span className="text-[10px] text-chart-good font-medium">✅ OK</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
            {step === "preview" ? (
              <>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  ← Chọn file khác
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={validCount === 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={16} />
                  Xác nhận nhập {duplicateAction === "overwrite" ? validCount : validCount - duplicateCount} thiết bị
                  {duplicateAction === "overwrite" && duplicateCount > 0 && ` (${duplicateCount} ghi đè)`}
                </button>
              </>
            ) : (
              <div className="flex-1 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportExcelModal;