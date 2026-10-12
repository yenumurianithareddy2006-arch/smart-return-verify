import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, WAREHOUSE_RETURNS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store current authenticated user; default to null or restore from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('srv_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic returns store so actions taken in Agent triage reflect in Warehouse queue
  const [returns, setReturns] = useState(() => {
    try {
      const saved = localStorage.getItem('srv_returns');
      return saved ? JSON.parse(saved) : WAREHOUSE_RETURNS;
    } catch {
      return WAREHOUSE_RETURNS;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('srv_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('srv_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('srv_returns', JSON.stringify(returns));
  }, [returns]);

  const loginAsRole = (roleKey) => {
    const user = DEMO_USERS[roleKey] || DEMO_USERS.company_admin;
    setCurrentUser(user);
    return user;
  };

  const loginWithCredentials = (email, password, remember = true) => {
    // For demo purposes, match known demo email or create an active session
    let matchedUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      matchedUser = {
        roleKey: "delivery_agent",
        roleName: "Delivery Agent",
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        company: "Verified Logistics Partner",
        avatar: email.substring(0, 2).toUpperCase(),
        badgeColor: "bg-blue-100 text-blue-800"
      };
    }
    setCurrentUser(matchedUser);
    return matchedUser;
  };

  const registerUser = ({ name, company, email, roleKey }) => {
    const roleMap = {
      delivery_agent: { name: "Delivery Agent", badge: "bg-blue-100 text-blue-800" },
      warehouse_staff: { name: "Warehouse Staff", badge: "bg-purple-100 text-purple-800" },
      company_admin: { name: "Company Administrator", badge: "bg-emerald-100 text-emerald-800" }
    };
    const roleInfo = roleMap[roleKey] || roleMap.delivery_agent;

    const newUser = {
      roleKey,
      roleName: roleInfo.name,
      name,
      email,
      company,
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'SR',
      badgeColor: roleInfo.badge
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReturnRecord = (newRecord) => {
    setReturns(prev => [newRecord, ...prev]);
  };

  const updateReturnStatus = (returnId, newStatus, newStatusType, notes) => {
    setReturns(prev => prev.map(item => {
      if (item.id === returnId) {
        return {
          ...item,
          status: newStatus,
          statusType: newStatusType,
          notes: notes || item.notes
        };
      }
      return item;
    }));
  };

  const resetDemoData = () => {
    setReturns(WAREHOUSE_RETURNS);
    localStorage.removeItem('srv_returns');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loginAsRole,
      loginWithCredentials,
      registerUser,
      logout,
      returns,
      addReturnRecord,
      updateReturnStatus,
      resetDemoData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
