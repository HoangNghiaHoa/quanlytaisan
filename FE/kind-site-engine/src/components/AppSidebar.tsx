import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, List, ArrowLeftRight, ClipboardCheck, Trash2,
  ChevronDown, ChevronRight, Building2, FileText, FileSpreadsheet, Menu, X,
  Calculator, Monitor, Layers, Bug, Lightbulb, MapPin, Shield, Wallet,
  LucideIcon, LogOut, Users,
} from "lucide-react";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useAuth } from "@/contexts/AuthContext";

// Map icon string names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Calculator, Monitor, Layers, Bug, Lightbulb, MapPin, Shield, Wallet,
};
// Department metadata for display purposes
const departmentMetadata: Record<string, { fullName: string; icon: any }> = {
  "BGĐ": { fullName: "Ban Giám Đốc", icon: Shield },
  "KTTH": { fullName: "Kế Toán Tổng Hợp", icon: Calculator },
  "CNTT": { fullName: "Công Nghệ Thông Tin", icon: Monitor },
  "GTGT": { fullName: "Giá Trị Gia Tăng", icon: Layers },
  "KTPM": { fullName: "Kỹ Thuật Phần Mềm", icon: Bug },
  "GPPM": { fullName: "Giải Pháp Phần Mềm", icon: Lightbulb },
  "PMHCM": { fullName: "Phần Mềm HCM", icon: MapPin },
  "ANTT": { fullName: "An Ninh Thông Tin", icon: Shield },
  "DVTC": { fullName: "Dịch Vụ Tài Chính", icon: Wallet }
};
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: { label: string; path: string; icon?: React.ReactNode }[];
}

const getMenuSections = (departments: any[]): { title: string; items: MenuItem[] }[] => [
  {
    title: "TỔNG QUAN",
    items: [
      { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    ],
  },
 {
    title: "QUẢN LÝ",
    items: [
      { label: "Danh sách CCDC", icon: <List size={18} />, path: "/danh-sach" },
      { label: "Xuất / Nhập kho", icon: <ArrowLeftRight size={18} /> },
      
      // ĐƯA PHÒNG BAN LÀM CẤP 2
      {
        label: "Danh sách đơn vị", 
        icon: <Building2 size={18} />,
        children: departments.map((d) => {
          const meta = departmentMetadata[d.name] || { fullName: d.name, icon: Building2 };
          return {
            label: meta.fullName,
            path: `/phong-ban/${d.id}`,
          };
        }),
      },
    ],
  },
  {
    title: "BÁO CÁO",
    items: [
      { label: "Báo cáo tổng hợp", icon: <FileText size={18} />, path: "/bao-cao" },
    ],
  },
];

const AppSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Ban Giám Đốc"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout, canAccessDepartment } = useAuth();
  const { departments } = useEquipment();

  const menuSections = getMenuSections(departments);

  // Filter departments for non-admin users
  const visibleDepartments = departments.filter((d) => canAccessDepartment(d.id));

  // Rebuild menu sections dynamically based on role
  const dynamicMenuSections = menuSections.map((section) => {
   return {
    ...section,
    items: section.items.map((item) => {
      // Nếu là mục có chứa danh sách phòng ban
      if (item.label === "Danh sách đơn vị") {
        return {
          ...item,
          children: item.children?.filter((child) => 
            visibleDepartments.some((d) => `/phong-ban/${d.id}` === child.path)
          ),
        };
      }
      return item;
    }),
  };
  });

  // Add admin-only menu
  const finalSections = isAdmin
    ? [
        ...dynamicMenuSections,
        {
          title: "HỆ THỐNG",
          items: [
            { label: "Quản lý tài khoản", icon: <Users size={18} />, path: "/quan-ly-tai-khoan" },
            { label: "Quản lý phòng ban", icon: <Building2 size={18} />, path: "/quan-ly-phong-ban" },
          ],
        },
      ]
    : dynamicMenuSections;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isChildActive = (children?: { path: string }[]) => children?.some((c) => location.pathname === c.path);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-stat-orange flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">V</span>
        </div>
        <div>
          <div className="text-sidebar-active-foreground font-bold text-sm">VNPT-Media</div>
          <div className="text-sidebar-foreground text-xs">QUẢN LÝ CCDC</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-4 mt-2">
        {finalSections.map((section) => (
          <div key={section.title}>
            <div className="text-sidebar-foreground text-[10px] font-semibold tracking-wider px-2 mb-1.5 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <div key={item.label}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-sidebar-active text-sidebar-active-foreground font-medium shadow-md shadow-sidebar-active/30"
                          : "text-sidebar-foreground hover:bg-sidebar-active/20 hover:text-sidebar-active-foreground hover:translate-x-0.5"
                      }`}
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-stat-orange text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => item.children && toggleExpand(item.label)}
                      className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isChildActive(item.children)
                          ? "bg-sidebar-active/30 text-sidebar-active-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-active/20 hover:text-sidebar-active-foreground hover:translate-x-0.5"
                      }`}
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.children && (expandedItems.includes(item.label) ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                    </button>
                  )}
                  {item.children && expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-0.5 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={`group w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                            location.pathname === child.path
                              ? "bg-sidebar-active/40 text-sidebar-active-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-active/20 hover:text-sidebar-active-foreground"
                          }`}
                        >
                          {child.icon ? (
                            <span className={`transition-colors ${location.pathname === child.path ? "text-sidebar-active-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-active-foreground"}`}>
                              {child.icon}
                            </span>
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              location.pathname === child.path ? "bg-sidebar-active-foreground" : "bg-sidebar-foreground/50 group-hover:bg-sidebar-active-foreground"
                            }`} />
                          )}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-stat-red flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">
              {currentUser?.displayName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sidebar-active-foreground text-sm font-medium truncate">{currentUser?.displayName || "User"}</div>
            <div className="text-sidebar-foreground text-[10px]">{isAdmin ? "Quản trị viên" : "Nhân viên"}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[998]" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 w-60 min-h-screen bg-sidebar flex-col z-[999] transition-transform duration-300 flex ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 text-sidebar-foreground hover:text-sidebar-active-foreground">
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen bg-sidebar flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
