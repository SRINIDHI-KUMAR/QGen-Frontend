// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // no need to load anything

  // ----- REMOVED: no automatic login from localStorage -----
  // The useEffect that read qgen_user is deleted.

  // Get registered users list (persisted)
  const getUsers = () => {
    return JSON.parse(localStorage.getItem("qgen_users") || "[]");
  };

  // Save users list (persisted)
  const saveUsers = (users) => {
    localStorage.setItem("qgen_users", JSON.stringify(users));
  };

  // ----- NO saveUser function – session is not persisted -----

  const login = (email, password, username) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      throw new Error("Invalid email or password. Please register first.");
    }

    // Set user in memory only – no localStorage save
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    return true;
  };

  const register = (email, password, username) => {
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password, // plain password for demo
    };

    users.push(newUser);
    saveUsers(users);

    // Log the user in (memory only)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
    // No localStorage removal needed because we never stored the session
  };

  const updateProfile = ({ username, email }) => {
    if (!user) return;
    const users = getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index].username = username;
      users[index].email = email;
      saveUsers(users);
      const updatedUser = { ...user, username, email };
      setUser(updatedUser);
    }
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!user) return;
    const users = getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index === -1) throw new Error("User not found.");
    if (users[index].password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    users[index].password = newPassword;
    saveUsers(users);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);