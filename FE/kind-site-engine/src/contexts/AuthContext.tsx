import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api, { loginApi } from "@/services/api";

export interface UserAccount {
  username: string;
  displayName: string;
  role: "admin" | "employee";
  departments: number[];
}

interface AuthState {
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
  canAccessDepartment: (deptId: number) => boolean;
  createUser: (user: any) => Promise<{ success: boolean; message: string }>;
  deleteUser: (username: string) =>Promise<void>;
  getUsers: () => UserAccount[];
}

const STORAGE_SESSION_KEY = "ccdc_session";
const STORAGE_TOKEN_KEY = "auth_token";

function loadSession(): AuthState {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw) as UserAccount;
      return { isLoggedIn: true, currentUser: user };
    }
  } catch {}
  return { isLoggedIn: false, currentUser: null };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(loadSession);

  const isAdmin = authState.currentUser?.role === "admin";

  const login = useCallback(async (username: string, password: string) => {
    try {
      console.log("[Auth] Đang gửi yêu cầu đăng nhập cho:", username);
      const response = await loginApi({ username, password });
      console.log("[Auth] Đăng nhập thành công:", response.user);

      // Lưu token vào localStorage
      localStorage.setItem(STORAGE_TOKEN_KEY, response.token);

      // Lưu thông tin user vào session
      const user: UserAccount = {
        username: response.user.username,
        displayName: response.user.displayName,
        role: response.user.role as "admin" | "employee",
       departments: response.user.departments.map((id: any) => Number(id)),
      };
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      setAuthState({ isLoggedIn: true, currentUser: user });

      return { success: true, message: "Đăng nhập thành công!" };
    } catch (err: any) {
      console.error("[Auth] Lỗi đăng nhập:", err.message);
      return { success: false, message: err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại." };
    }
  }, []);

  const logout = useCallback(() => {
    console.log("[Auth] Đăng xuất");
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    setAuthState({ isLoggedIn: false, currentUser: null });
  }, []);

  const canAccessDepartment = useCallback(
    (deptId: number) => {
      if (!authState.currentUser) return false;
      if (authState.currentUser.role === "admin") return true;
      return authState.currentUser.departments.includes(deptId);
    },
    [authState.currentUser]
  );

  //Thêm state mới vào trong AuthProvider để quản lý danh sách người dùng (dự kiến sẽ lấy từ API)
  const  [allUsers, setAllUsers] = useState<UserAccount[]>([]); 

//1 . Take List user from API
  const fetchUsers = useCallback(async () => {
    try{
      const response = await api.get("/users");
      setAllUsers(response.data);
    }catch(err){
      console.error("[Auth] Lỗi khi lấy danh sách người dùng:", err);
    }
  }, [])
//2 Create new user
  const createUser = useCallback(async (userData: any) =>{
    try{
      const payload ={...userData, role :"EMPLOYEE"};
      await api.post("/users",payload);

      await fetchUsers(); //Load lại danh sách người dùng sau khi tạo mới
      return {success:true, message:"Tạo tài khoản thành công!"};

    }catch(err){
      const msg = err.response?.data || "Không thể kết nối máy chủ";
      return { success: false, message: msg };
    }
  },[fetchUsers])
//3 Delete user
  const deleteUser = useCallback(async (username:string)=>{
  if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)){
    try{
      await api.delete(`/users/${username}`);
      await fetchUsers(); // Load lại danh sách sau khi xóa     
     }catch(err){
      alert("Xóa thất bại!");
    }
  }
  },[fetchUsers])
//4 Get list user
  const getUsers = useCallback(() => {
  return allUsers;
}, [allUsers]);
// Automatically load when Admin login
 useEffect(() => {
  if (authState.isLoggedIn && authState.currentUser?.role === "admin") {
    fetchUsers();
  }
}, [authState.isLoggedIn, authState.currentUser, fetchUsers]);
  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, isAdmin, canAccessDepartment, createUser, deleteUser, getUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
