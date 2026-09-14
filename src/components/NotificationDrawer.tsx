"use client";

import React from "react";
import { X, Bell, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { NotificationItem } from "@/types";

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  onClose,
  onClearAll,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#eaeff8] animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0c142c]" />
              <h3 className="font-bold text-[16px] text-[#0c142c]">Notifications</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                {notifications.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#f1f5fb] flex items-center justify-center text-[#64748b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-[#94a3b8] text-[13px]">
                No new notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#eef2f8] hover:border-indigo-200 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getIcon(n.type)}
                      <span className="font-bold text-[13px] text-[#0c142c]">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#475569] leading-relaxed pl-6">{n.message}</p>
                  <div className="mt-2 pl-6 text-[10px] text-[#94a3b8] font-medium">
                    Source: {n.source}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f1f5f9] bg-[#fafbfd]">
          <button
            onClick={onClearAll}
            className="w-full py-2.5 rounded-xl border border-[#cbd5e1] hover:bg-white text-[12px] font-semibold text-[#64748b] transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};

