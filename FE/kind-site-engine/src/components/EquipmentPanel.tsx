import { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useToast } from "@/hooks/use-toast";

const makeEmptyForm = (defaultDeptId: number, defaultDeptName: string) => ({
  id: undefined as number | undefined,
  name: "", 
  serial: "", 
  quantity: 1, 
  unit: "Cái", 
  yearManufacture: null as number | null,
  yearUse: null as number | null, 
  country: "", 
  brand: "", 
  model: "", 
  capacity: "",
  status: "Đang sử dụng", // Đồng bộ nhãn với Dashboard
  demand: "Thường xuyên", 
  note: "",
  departmentId: defaultDeptId, 
  departmentName: defaultDeptName,
});

interface EquipmentPanelProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  itemId: number | null;
}

const EquipmentPanel = ({ open, onClose, mode, itemId }: EquipmentPanelProps) => {
  const { getById, addEquipment, updateEquipment, departments } = useEquipment();
  const { toast } = useToast();
  const emptyForm = useMemo(() => 
    makeEmptyForm(
      departments[0]?.id ? Number(departments[0].id) : 0, 
      departments[0]?.name || ""
    ), 
    [departments]
  );
  const [form, setForm] = useState(emptyForm);

useEffect(() => {
  if (open && (mode === "edit" || mode === "view") && itemId) {
    const item = getById(itemId);
    if (item) {
      setForm({
        ...item,
        // Ép kiểu chắc chắn về number để hết báo đỏ "incompatible"
        departmentId: Number(item.departmentId), 
        // Đảm bảo yearManufacture và yearUse nhận null nếu dữ liệu trống
        yearManufacture: item.yearManufacture ?? null,
        yearUse: item.yearUse ?? null
      });
    }
  } else if (open && mode === "add") {
    setForm({ ...emptyForm });
  }
}, [open, mode, itemId, getById, emptyForm]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => {
      // Nếu là departmentId, ép kiểu về number
      const finalValue = key === "departmentId" ? Number(value) : value;
      const updated = { ...prev, [key]: finalValue };
      
      if (key === "departmentId") {
        const dept = departments.find((d) => Number(d.id) === Number(value));
        if (dept) updated.departmentName = dept.name;
      }
      return updated;
    });
  };

 const handleSave = () => {
  if (!form.name || !form.serial) {
    toast({ title: "Vui lòng nhập đầy đủ tên và serial", variant: "destructive" });
    return;
  }

  // Tạo một object mới dựa trên form nhưng ép departmentId về string
  // để khớp với Interface Equipment (đang là string)
  const submissionData = {
    ...form,
    departmentId: String(form.departmentId) 
  };

  if (mode === "edit" && itemId) {
    // Truyền submissionData thay vì form
    updateEquipment(itemId, submissionData as any); 
    toast({ title: "Cập nhật thành công!" });
  } else {
    // Truyền submissionData thay vì form
    addEquipment(submissionData as any);
    toast({ title: "Thêm mới thành công!" });
  }
  onClose();
};
  const isView = mode === "view";
  const titles = { add: "Thêm công cụ dụng cụ mới", edit: "Sửa thông tin công cụ", view: "Xem chi tiết công cụ" };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 w-full max-w-[600px] h-full bg-card shadow-[-4px_0_20px_rgba(0,0,0,0.15)] z-[1000] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">{titles[mode]}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block mb-1.5 text-[13px] font-medium text-foreground">Tên công cụ dụng cụ <span className="text-destructive">*</span></label>
            <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all disabled:opacity-60" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Serial <span className="text-destructive">*</span></label>
              <input value={form.serial} onChange={(e) => handleChange("serial", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Số lượng</label>
              <input type="number" value={form.quantity} onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">ĐVT</label>
              <select value={form.unit} onChange={(e) => handleChange("unit", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60">
                {["Cái", "Bộ", "Chiếc", "Máy", "Cặp"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Phòng ban</label>
              <select value={form.departmentId} onChange={(e) => handleChange("departmentId", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60">
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Năm SX</label>
              <input type="number" value={form.yearManufacture ?? ""} onChange={(e) => handleChange("yearManufacture", e.target.value ? parseInt(e.target.value) : null)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Năm SD</label>
              <input type="number" value={form.yearUse ?? ""} onChange={(e) => handleChange("yearUse", e.target.value ? parseInt(e.target.value) : null)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Nước SX</label>
              <input value={form.country} onChange={(e) => handleChange("country", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Hãng SX</label>
              <input value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Mã hiệu</label>
              <input value={form.model} onChange={(e) => handleChange("model", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Công suất</label>
              <input value={form.capacity} onChange={(e) => handleChange("capacity", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Hiện trạng</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60">
                {["Đang sử dụng", "Nhàn rỗi", "Hỏng"].map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium text-foreground">Nhu cầu SD</label>
              <select value={form.demand} onChange={(e) => handleChange("demand", e.target.value)} disabled={isView} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60">
                {["Thường xuyên", "Theo đợt", "Cần bổ sung", "Dự phòng"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-[13px] font-medium text-foreground">Ghi chú</label>
            <textarea value={form.note} onChange={(e) => handleChange("note", e.target.value)} disabled={isView} rows={3} className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card focus:outline-none focus:border-primary transition-all disabled:opacity-60 resize-y" />
          </div>
        </div>

        {!isView && (
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-all">Hủy</button>
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
              <Save size={14} /> Lưu
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EquipmentPanel;
