
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  contactNumber: string;
  createdAt: string;
}

interface DataContextType {
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, "id" | "createdAt" | "status">) => void;
  updateLeaveStatus: (id: string, status: "approved" | "rejected") => void;
  setCustomLeaveRequests: (requests: LeaveRequest[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Mock data
const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    studentId: "student@example.com",
    studentName: "John Doe",
    reason: "Family function",
    startDate: "2025-04-15",
    endDate: "2025-04-18",
    status: "pending",
    contactNumber: "9876543210",
    createdAt: "2025-04-10T10:30:00Z"
  },
  {
    id: "2",
    studentId: "jane@example.com",
    studentName: "Jane Smith",
    reason: "Medical appointment",
    startDate: "2025-04-12",
    endDate: "2025-04-13",
    status: "approved",
    contactNumber: "8765432109",
    createdAt: "2025-04-08T14:45:00Z"
  },
  {
    id: "3",
    studentId: "bob@example.com",
    studentName: "Bob Johnson",
    reason: "Personal emergency",
    startDate: "2025-04-20",
    endDate: "2025-04-22",
    status: "rejected",
    contactNumber: "7654321098",
    createdAt: "2025-04-09T09:15:00Z"
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const addLeaveRequest = (request: Omit<LeaveRequest, "id" | "createdAt" | "status">) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 9),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests([...leaveRequests, newRequest]);
  };

  const updateLeaveStatus = (id: string, status: "approved" | "rejected") => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  // New function to set custom leave requests
  const setCustomLeaveRequests = (requests: LeaveRequest[]) => {
    setLeaveRequests(requests);
  };

  return (
    <DataContext.Provider value={{ leaveRequests, addLeaveRequest, updateLeaveStatus, setCustomLeaveRequests }}>
      {children}
    </DataContext.Provider>
  );
};
