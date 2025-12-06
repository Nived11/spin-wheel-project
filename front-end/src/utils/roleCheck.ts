export const getUserRole = (): "admin" | "superadmin" | null => {
  return localStorage.getItem("adminRole") as "admin" | "superadmin" | null;
};

export const isSuperAdmin = (): boolean => {
  return getUserRole() === "superadmin";
};

export const isAdmin = (): boolean => {
  return getUserRole() === "admin";
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("adminToken") && !!localStorage.getItem("adminRole");
};
