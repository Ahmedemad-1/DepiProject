/**
 * CONTEXT : AuthContext
 * OWNER   : Heba Talaat (suggested - change if the team reassigns)
 * PURPOSE : Holds the logged-in user so any component can read it with useAuth().
 *
 * user shape (from db.json): { id, name, email, phone, role }   role = 'customer' | 'admin'
 * NOTE    : Working base. The user is saved in localStorage so a refresh keeps the login.
 *           Never keep the password in state: remove it before calling login(user).
 */
import { createContext, useContext, useState } from "react";
import { loadJSON, saveJSON, removeKey } from "../utils/storage.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(STORAGE_KEY, null));

  function login(userData) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = userData;
    setUser(safeUser);
    saveJSON(STORAGE_KEY, safeUser);
  }

  function logout() {
    setUser(null);
    removeKey(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
