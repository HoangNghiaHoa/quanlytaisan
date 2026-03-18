import { Eye, Pencil, Trash2 } from "lucide-react";

const activities = [
  {
    stt: 1,
    name: "CPU máy tính - Liêu Thị Thảo",
    code: "3E625G261489",
    serial: "1E425B264149",
    department: "KTTH",
    year: 2016,
    status: "Chưa xác định",
  },
  {
    stt: 2,
    name: "Màn hình Dell P2419H",
    code: "4F738H392501",
    serial: "2F536C375260",
    department: "CNTT",
    year: 2019,
    status: "Tốt",
  },
  {
    stt: 3,
    name: "Máy in HP LaserJet Pro",
    code: "5G841I403612",
    serial: "3G647D486371",
    department: "KTTH",
    year: 2020,
    status: "Cần kiểm tra",
  },
];

const statusStyles: Record<string, string> = {
  "Tốt": "bg-chart-good/10 text-chart-good",
  "Cần kiểm tra": "bg-stat-blue/10 text-stat-blue",
  "Chưa xác định": "bg-chart-unknown/10 text-chart-unknown",
  "Hỏng / Mất": "bg-stat-orange/10 text-stat-orange",
};

const RecentActivity = () => {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between p-5 pb-3">
        <h3 className="font-semibold text-card-foreground">🕐 Hoạt động gần đây</h3>
        <button className="text-xs text-primary font-medium hover:underline">10 mục ›</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-t border-border">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">STT</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">TÊN CCDC</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">SERIAL</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">PHÒNG BAN</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">NĂM SD</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">HIỆN TRẠNG</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={item.stt} className="border-t border-border hover:bg-primary/5 transition-colors duration-200 cursor-default">
                <td className="px-5 py-3 text-muted-foreground">{item.stt}</td>
                <td className="px-5 py-3">
                  <div className="font-medium text-card-foreground">{item.name}</div>
                  <div className="text-[11px] text-muted-foreground">{item.code}</div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{item.serial}</td>
                <td className="px-5 py-3">
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">
                    {item.department}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{item.year}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[item.status] || ""}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-md hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-stat-orange/10 transition-colors text-muted-foreground hover:text-stat-orange">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-stat-red/10 transition-colors text-muted-foreground hover:text-stat-red">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
