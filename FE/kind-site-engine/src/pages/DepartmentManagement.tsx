import { useState } from "react";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useToast } from "@/hooks/use-toast";
import AppSidebar from "@/components/AppSidebar";
import { Building2, Plus, Pencil, Trash2, Save, X,
  Calculator, Monitor, Layers, Bug, Lightbulb, MapPin, Shield, Wallet, Briefcase, Globe, Cpu, Server, LucideIcon
} from "lucide-react";

const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Calculator", icon: Calculator },
  { name: "Monitor", icon: Monitor },
  { name: "Layers", icon: Layers },
  { name: "Bug", icon: Bug },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "MapPin", icon: MapPin },
  { name: "Shield", icon: Shield },
  { name: "Wallet", icon: Wallet },
  { name: "Briefcase", icon: Briefcase },
  { name: "Globe", icon: Globe },
  { name: "Cpu", icon: Cpu },
  { name: "Server", icon: Server },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(AVAILABLE_ICONS.map((i) => [i.name, i.icon]));

const DepartmentManagement = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment, equipmentData } = useEquipment();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [short, setShort] = useState("");
  const [icon, setIcon] = useState("Briefcase");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editShort, setEditShort] = useState("");
  const [editIcon, setEditIcon] = useState("");


  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !short.trim()) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    addDepartment({ 
      id: 0, // Giá trị tạm, BE sẽ ghi đè
      name: name.trim(), 
      shortName: short.trim().toUpperCase(), 
      icon 
    });
    toast({ title: `Đã thêm phòng ban "${name.trim()}"` });
    setName("");
    setShort("");
    setIcon("Briefcase");
  };

  const startEdit = (dept: typeof departments[0]) => {
    setEditingId(dept.id);
    setEditName(dept.name);
    setEditShort(dept.shortName);
    setEditIcon(dept.icon);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editShort.trim()) return;
    updateDepartment(editingId!, { name: editName.trim(), shortName: editShort.trim().toUpperCase(), icon: editIcon });
    toast({ title: `Đã cập nhật phòng ban` });
    setEditingId(null);
  };

  const handleDelete = (id: number, name: string) => {
    const count = equipmentData.filter((e) => e.departmentId === String(id)).length;
    const msg = count > 0 ? `Phòng ban "${name}" có ${count} thiết bị. Xóa sẽ mất toàn bộ dữ liệu. Tiếp tục?` : `Bạn có chắc chắn muốn xóa phòng ban "${name}"?`;
    if (confirm(msg)) {
      deleteDepartment(id);
      toast({ title: `Đã xóa phòng ban "${name}"` });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <header className="flex items-center gap-2 px-4 sm:px-6 py-4 bg-card border-b border-border">
          <Building2 size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-foreground">Quản lý phòng ban</h1>
        </header>

        <div className="p-4 sm:p-6 grid gap-6 lg:grid-cols-2">
          {/* Add form */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 h-fit">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Plus size={18} className="text-primary" /> Thêm phòng ban mới
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên phòng ban</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="vd: Phòng Nhân sự" className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên viết tắt</label>
                <input value={short} onChange={(e) => setShort(e.target.value)} placeholder="vd: NS" className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((ic) => {
                    const Ic = ic.icon;
                    return (
                      <button key={ic.name} type="button" onClick={() => setIcon(ic.name)}
                        className={`p-2.5 rounded-lg border transition-all flex items-center justify-center ${icon === ic.name ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary text-muted-foreground"}`}>
                        <Ic size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Plus size={16} /> Thêm phòng ban
              </button>
            </form>
          </div>

          {/* Department list */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Building2 size={18} className="text-primary" /> Danh sách phòng ban ({departments.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {departments.map((dept) => {
                const IconComp = iconMap[dept.icon] || Briefcase;
                const count = equipmentData.filter((e) => e.departmentId === String(dept.id)).length;

                if (editingId === dept.id) {
                  return (
                    <div key={dept.id} className="p-3 rounded-lg bg-primary/5 border border-primary/30 space-y-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1.5 rounded border border-border bg-card text-sm" />
                      <input value={editShort} onChange={(e) => setEditShort(e.target.value)} className="w-full px-2 py-1.5 rounded border border-border bg-card text-sm" />
                      <div className="flex gap-1 flex-wrap">
                        {AVAILABLE_ICONS.map((ic) => {
                          const Ic = ic.icon;
                          return (
                            <button key={ic.name} type="button" onClick={() => setEditIcon(ic.name)}
                              className={`p-1.5 rounded border transition-all ${editIcon === ic.name ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                              <Ic size={14} />
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex-1 py-1.5 bg-primary text-primary-foreground rounded text-sm flex items-center justify-center gap-1"><Save size={14} /> Lưu</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 border border-border rounded text-sm flex items-center justify-center gap-1"><X size={14} /> Hủy</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={dept.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{dept.name}</div>
                        <div className="text-xs text-muted-foreground">{dept.shortName} · {count} thiết bị</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(dept)} className="p-2 text-muted-foreground hover:text-stat-orange hover:bg-stat-orange/10 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(dept.id, dept.name)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentManagement;
