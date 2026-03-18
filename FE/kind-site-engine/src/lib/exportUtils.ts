import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { Equipment } from "@/contexts/EquipmentContext";

export const exportToExcel = (data: Equipment[], title: string) => {
  const rows = data.map((item, i) => ({
    "STT": i + 1,
    "Tên công cụ dụng cụ": item.name,
    "Serial": item.serial,
    "Số lượng": item.quantity,
    "ĐVT": item.unit,
    "Năm SX": item.yearManufacture || "-",
    "Năm SD": item.yearUse || "-",
    "Nước SX": item.country,
    "Hãng SX": item.brand,
    "Model": item.model,
    "Phòng ban": item.departmentName,
    "Hiện trạng": item.status,
    "Nhu cầu SD": item.demand,
    "Ghi chú": item.note,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sach CCDC");

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String((r as any)[key] || "").length)) + 2,
  }));
  ws["!cols"] = colWidths;

  const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const exportToPDF = (data: Equipment[], title: string) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(`BAO CAO TAI SAN - ${title.toUpperCase()}`, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Ngay xuat: ${new Date().toLocaleDateString("vi-VN")}  |  Tong so: ${data.length} thiet bi`, 14, 22);

  // Table
  const tableData = data.map((item, i) => [
    i + 1,
    item.name,
    item.serial,
    item.quantity,
    item.unit,
    item.yearUse || "-",
    item.country,
    item.brand,
    item.departmentName,
    item.status,
    item.demand,
  ]);

  (doc as any).autoTable({
    startY: 28,
    head: [["STT", "Ten CCDC", "Serial", "SL", "DVT", "Nam SD", "Nuoc SX", "Hang SX", "Phong ban", "Hien trang", "Nhu cau"]],
    body: tableData,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [41, 65, 122], textColor: 255, fontStyle: "bold", fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 45 },
      2: { cellWidth: 28 },
      3: { cellWidth: 10, halign: "center" },
      4: { cellWidth: 12 },
    },
    margin: { top: 28 },
    didDrawPage: (data: any) => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Trang ${data.pageNumber}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 8);
      doc.text("VNPT-Media - He thong Quan ly CCDC", 14, doc.internal.pageSize.height - 8);
    },
  });

  const fileName = `BaoCao_${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
