"use client";

import React, { useEffect, useState } from "react";
import { ProgressCategory } from "@/types/dashboard";
import { ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TiltCard } from "./TiltCard";

interface YourProgressProps {
  progressList: ProgressCategory[];
}

export const YourProgress: React.FC<YourProgressProps> = ({ progressList }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <TiltCard glow="none" className="h-full">
      <div className="card-base flex flex-col justify-between h-full group/card transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="h3-scale text-ink">Your progress</h3>
              <p className="caption text-ink-muted">
                Rolling 30-day performance aggregates
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold">
              5 tracked tracks
            </span>
          </div>

          {/* Categories List with Mini Trend Bars */}
          <div className="divide-y divide-border/80 dark:divide-zinc-800">
            {progressList.map((item) => (
              <div
                key={item.category}
                className="py-2.5 px-2 -mx-2 rounded-lg first:pt-2 last:pb-2 flex items-center justify-between gap-4 transition-all duration-150 hover:bg-canvas/70 group/row"
              >
                {/* Category info */}
                <div className="w-28 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink group-hover/row:text-accent transition-colors">
                      {item.category}
                    </span>
                  </div>
                  <div className="caption text-ink-muted leading-tight mt-0.5">
                    {item.deltaText}
                  </div>
                </div>

                {/* Mini Trend Bar Chart */}
                <div className="flex-1 h-7 max-w-[140px] transition-transform duration-200 group-hover/row:scale-105">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={item.trend} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {item.trend.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === item.trend.length - 1
                                  ? "var(--accent)"
                                  : "var(--border)"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-canvas rounded-sm animate-pulse" />
                  )}
                </div>

                {/* Current Score */}
                <div className="w-12 text-right flex-shrink-0">
                  <span className="text-[14px] font-bold text-ink">
                    {item.currentScore}
                    <span className="text-[11px] font-normal text-ink-muted">%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between text-[12px] text-ink-muted">
          <span>Activity logged daily</span>
          <span className="text-accent font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            All tracks active
          </span>
        </div>
      </div>
    </TiltCard>
  );
};
