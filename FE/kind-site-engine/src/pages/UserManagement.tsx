import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useToast } from "@/hooks/use-toast";
import AppSidebar from "@/components/AppSidebar";
import { UserPlus, Trash2, Users, Eye, EyeOff } from "lucide-react";

const UserManagement = () => {
  const { getUsers, createUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const { departments } = useEquipment();
  const DEPARTMENTS = departments;
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState<number[]>([]);
  const users = getUsers();

  const toggleDept = (id: number) => {
    setSelectedDepts((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !displayName.trim()) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }
    if (selectedDepts.length === 0) {
      toast({ title: "Vui lòng chọn ít nhất một phòng ban", variant: "destructive" });
      return;
    }
    //await createUser
    const result =  await  createUser({ 
      username: username.trim(), 
      password, 
      displayName: displayName.trim(), 
      departments: selectedDepts.map(id => String(id))
    });

    toast({ title: result.message, variant: result.success ? "default" : "destructive" });
    if (result.success) {
      setUsername("");
      setDisplayName("");
      setPassword("");
      setSelectedDepts([]);
    }
};

    const handleDelete = async (uname: string) => {
      await deleteUser(uname);
      toast({ title: `Đã xoá tài khoản "${uname}"` });
    };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <header className="flex items-center gap-2 px-4 sm:px-6 py-4 bg-card border-b border-border">
          <Users size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-foreground">Quản lý tài khoản</h1>
        </header>

        <div className="p-4 sm:p-6 grid gap-6 lg:grid-cols-2">
          {/* Create form */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <UserPlus size={18} className="text-primary" /> Tạo tài khoản mới
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên đăng nhập</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vd: nguyenvana"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên hiển thị</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="vd: Nguyễn Văn A"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phòng ban được cấp quyền</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {DEPARTMENTS.map((d) => (
                    <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer select-none hover:bg-secondary/50 p-1.5 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(d.id)}
                        onChange={() => toggleDept(d.id)}
                        className="w-4 h-4 accent-primary"
                      />
                      {d.name}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <UserPlus size={16} /> Tạo tài khoản
              </button>
            </form>
          </div>

          {/* User list */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Users size={18} className="text-primary" /> Danh sách tài khoản ({users.length})
            </h2>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có tài khoản nào.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {users.map((u) => (
                  <div key={u.username} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors">
                    <div>
                      <div className="font-medium text-sm text-foreground">{u.displayName}</div>
                      <div className="text-xs text-muted-foreground">@{u.username}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {u.departments.map((dept : any) => {
                          const currentId = typeof dept === 'object' ? dept.id : dept;
                          const deptInfo = DEPARTMENTS.find((d) => Number(d.id) === Number(currentId));
                          return (
                           <span key={currentId} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium">
                              {dept.shortName || deptInfo?.shortName || `ID: ${currentId}`}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(u.username)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
