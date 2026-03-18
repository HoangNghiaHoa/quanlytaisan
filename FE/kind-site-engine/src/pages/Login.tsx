import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Wrench, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!username || !password) {
      setAlert({ message: "Vui lòng nhập đầy đủ thông tin đăng nhập", type: "error" });
      return;
    }

    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      setAlert({ message: "Đăng nhập thành công! Đang chuyển hướng...", type: "success" });
      if (rememberMe) localStorage.setItem("rememberedUser", username);
      setTimeout(() => navigate("/"), 800);
    } else {
      setAlert({ message: result.message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Floating shapes */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -top-[150px] -left-[150px] animate-[float_20s_infinite_ease-in-out]" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-white/10 -bottom-[100px] -right-[100px] animate-[float_20s_infinite_ease-in-out_5s]" />
      <div className="absolute w-[150px] h-[150px] rounded-full bg-white/10 top-1/2 right-[10%] animate-[float_20s_infinite_ease-in-out_10s]" />

      <div className="relative z-10 w-full max-w-[450px] animate-[slideUp_0.6s_ease-out]">
        <div className="bg-card rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary/80 px-10 pt-10 pb-8 text-center relative">
            <div className="w-[70px] h-[70px] bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-md">
              <Wrench size={32} className="text-primary-foreground" />
            </div>
            <h1 className="text-primary-foreground text-2xl font-bold mb-2">Đăng Nhập Hệ Thống</h1>
            <p className="text-primary-foreground/90 text-sm">Quản Lý Công Cụ - Dụng Cụ</p>
            <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-card rounded-t-[50%]" />
          </div>

          {/* Body */}
          <div className="px-10 pb-10 pt-4">
            {alert && (
              <div
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg mb-5 text-sm animate-[slideDown_0.3s_ease-out] ${
                  alert.type === "error" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-chart-good/10 text-chart-good border border-chart-good/20"
                }`}
              >
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-foreground">Tên đăng nhập</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl text-[15px] bg-secondary transition-all focus:outline-none focus:border-primary focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">👤</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-foreground">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-border rounded-xl text-[15px] bg-secondary transition-all focus:outline-none focus:border-primary focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">🔒</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-[18px] h-[18px] cursor-pointer accent-primary"
                  />
                  <span className="text-foreground">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl text-base font-semibold flex items-center justify-center gap-2.5 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_10px_25px_hsl(var(--primary)/0.3)] active:translate-y-0 transition-all disabled:opacity-80 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang kết nối Server...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Đăng Nhập
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white/90 text-[13px] z-5">
        © 2025 Equipment Management System.
      </div>
    </div>
  );
};

export default Login;
