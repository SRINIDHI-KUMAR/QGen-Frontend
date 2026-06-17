// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted user and registered users from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("qgen_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Get registered users list
  const getUsers = () => {
    return JSON.parse(localStorage.getItem("qgen_users") || "[]");
  };

  // Save users list
  const saveUsers = (users) => {
    localStorage.setItem("qgen_users", JSON.stringify(users));
  };

  // Save current user
  const saveUser = (userData) => {
    localStorage.setItem("qgen_user", JSON.stringify(userData));
  };

  const login = (email, password, username) => {
    const users = getUsers();
    // Check if a user with this email and password exists
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      throw new Error("Invalid email or password. Please register first.");
    }

    // Set the user (omit password from the stored user object)
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    saveUser(userWithoutPassword);
    return true;
  };

  const register = (email, password, username) => {
    const users = getUsers();

    // Check if email already registered
    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password, // store plain password for demo; in production, hash it!
    };

    // Save to users list
    users.push(newUser);
    saveUsers(users);

    // Log the user in (omit password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    saveUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("qgen_user");
  };

  // Optional: update profile (for Edit Profile page)
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
      saveUser(updatedUser);
    }
  };

  // Optional: change password
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