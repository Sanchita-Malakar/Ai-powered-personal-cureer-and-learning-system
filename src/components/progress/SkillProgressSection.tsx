"use client";

import React from "react";
import { SkillProgressItem, SkillTrajectoryPoint } from "@/types/progress";
import {
  Code2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Layers,
  Database,
  Brain,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface SkillProgressSectionProps {
  skills: SkillProgressItem[];
  trajectory: SkillTrajectoryPoint[];
  onOpenSkillModule?: (skillName: string) => void;
}

export const SkillProgressSection: React.FC<SkillProgressSectionProps> = ({
  skills,
  trajectory,
  onOpenSkillModule,
}) => {
  const getSkillIcon = (name: string) => {
    switch (name) {
      case "Python":
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case "DSA":
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case "SQL":
        return <Database className="w-4 h-4 text-amber-400" />;
      case "AI/ML":
        return <Brain className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Strong":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Intermediate":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "Focus Area":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Rolling 6-Month Velocity
          </span>
          <h2 className="text-xl font-bold text-white">Skill Progress</h2>
          <p className="text-xs text-slate-400">
            Performance trajectory across core programming, algorithms, database, and machine learning
          </p>
        </div>
      </div>

      {/* 4 Skill Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((item) => (
          <div
            key={item.skill}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getSkillIcon(item.skill)}
                  </div>
                  <span className="font-bold text-white text-sm">{item.skill}</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getLevelBadge(
                    item.level
                  )}`}
                >
                  {item.level}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-white font-mono">
                  {item.currentScore}%
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{item.deltaPercentage}% this month
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.highlight}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${item.currentScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Trajectory Graph */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              6-Month Competency Trajectory (Apr – Sep)
            </h3>
            <p className="text-xs text-slate-400">
              DSA experienced the sharpest climb (+18%), followed by Python Advanced (+12%)
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target Benchmark: 80%
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trajectory}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis domain={[20, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="Python"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="DSA"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="SQL"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="AIML"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
