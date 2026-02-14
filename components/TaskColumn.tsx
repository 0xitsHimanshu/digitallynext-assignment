"use client";

import { useState } from "react";
import type { Task } from "@/app/dashboard/page";
import TaskCard from "./TaskCard";
import { ListTodo, Clock, CheckCircle2 } from "lucide-react";

interface TaskColumnProps {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
  onUpdateStatus: (
    taskId: string,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => void;
}

const columnConfig = {
  TODO: {
    icon: ListTodo,
    headerBg: "bg-slate-100",
    headerText: "text-slate-700",
    countBg: "bg-slate-200",
    dropHighlight: "ring-2 ring-slate-400 bg-slate-50",
  },
  IN_PROGRESS: {
    icon: Clock,
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    countBg: "bg-blue-200",
    dropHighlight: "ring-2 ring-blue-400 bg-blue-50",
  },
  DONE: {
    icon: CheckCircle2,
    headerBg: "bg-green-50",
    headerText: "text-green-700",
    countBg: "bg-green-200",
    dropHighlight: "ring-2 ring-green-400 bg-green-50",
  },
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onUpdateStatus,
}: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = columnConfig[status];
  const Icon = config.icon;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set false when leaving the column entirely, not when entering a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData("taskId");
    const sourceStatus = e.dataTransfer.getData("sourceStatus");

    // Only update if dropped in a different column
    if (taskId && sourceStatus !== status) {
      onUpdateStatus(taskId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white rounded-lg shadow transition-all duration-200 ${
        isDragOver ? config.dropHighlight : ""
      }`}
    >
      {/* Column Header */}
      <div
        className={`${config.headerBg} rounded-t-lg px-4 py-3 flex items-center justify-between`}
      >
        <div className={`flex items-center gap-2 ${config.headerText}`}>
          <Icon size={18} />
          <h2 className="font-semibold">{title}</h2>
        </div>
        <span
          className={`${config.countBg} ${config.headerText} text-xs font-bold px-2 py-1 rounded-full`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="p-3 space-y-2 min-h-[200px]">
        {tasks.length === 0 ? (
          <div
            className={`text-center py-8 rounded-lg border-2 border-dashed transition-colors ${
              isDragOver
                ? "border-gray-400 text-gray-500"
                : "border-transparent text-gray-400"
            }`}
          >
            <p className="text-sm">
              {isDragOver ? "Drop here" : "No tasks"}
            </p>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {isDragOver && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-sm text-gray-400">
                Drop here
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
