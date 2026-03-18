import { Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useEquipment } from "@/contexts/EquipmentContext";

const ApiStatusGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, apiError, refreshData } = useEquipment();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Đang tải dữ liệu từ Server...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <WifiOff size={32} className="text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Không kết nối được Backend</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          {apiError}
        </p>
        <p className="text-muted-foreground text-xs">
          Vui lòng kiểm tra Backend đang chạy tại <code className="bg-muted px-1.5 py-0.5 rounded text-xs">localhost:8081</code>
        </p>
        <button
          onClick={refreshData}
          className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={16} />
          Thử lại
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiStatusGuard;
