"use client";

import { useState } from "react";
import { DashboardData } from "@/types/dashboard";
import { initialDashboardData } from "@/data/mockDashboardData";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [isPlanStarted, setIsPlanStarted] = useState(false);

  const togglePlanItem = (itemId: string) => {
    setData((prev) => ({
      ...prev,
      aiPlan: {
        ...prev.aiPlan,
        items: prev.aiPlan.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      },
    }));
  };

  const startPlan = () => {
    setIsPlanStarted(true);
  };

  const dismissAlert = (alertId: string) => {
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== alertId),
    }));
  };

  return {
    data,
    isPlanStarted,
    togglePlanItem,
    startPlan,
    dismissAlert,
  };
}
