import React, { createContext } from "react";

export const NotificationContext = createContext({
  notifications: []
});

export function NotificationProvider({ children }) {
  return <NotificationContext.Provider value={{ notifications: [] }}>{children}</NotificationContext.Provider>;
}
