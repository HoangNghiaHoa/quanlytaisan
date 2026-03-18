import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

const ForbiddenPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4 p-8">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
        <ShieldX size={40} className="text-destructive" />
      </div>
      <h1 className="text-4xl font-bold text-foreground">403</h1>
      <p className="text-lg text-muted-foreground">Bạn không có quyền truy cập trang này.</p>
      <Link
        to="/"
        className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Về trang chủ
      </Link>
    </div>
  </div>
);

export default ForbiddenPage;
