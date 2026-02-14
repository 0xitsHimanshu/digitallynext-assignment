"use client";

import type { Task } from "@/app/dashboard/page";
import { ListTodo, Clock, CheckCircle2, GripVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const statusConfig: Record<
  string,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    cardBorder: string;
    cardBg: string;
    icon: typeof ListTodo;
  }
> = {
  TODO: {
    label: "To Do",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    cardBorder: "border-l-slate-400",
    cardBg: "bg-white",
    icon: ListTodo,
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    cardBorder: "border-l-blue-500",
    cardBg: "bg-blue-50/30",
    icon: Clock,
  },
  DONE: {
    label: "Done",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
    cardBorder: "border-l-green-500",
    cardBg: "bg-green-50/30",
    icon: CheckCircle2,
  },
};

export default function TaskCard({ task }: TaskCardProps) {
  const config = statusConfig[task.status];
  const Icon = config.icon;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("sourceStatus", task.status);
    e.dataTransfer.effectAllowed = "move";

    // Add a slight delay to apply the dragging style
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      target.classList.add("opacity-40", "scale-95");
    });
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-40", "scale-95");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${config.cardBg} border border-gray-200 border-l-4 ${config.cardBorder} rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group`}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div className="text-gray-300 group-hover:text-gray-400 mt-0.5 transition-colors shrink-0">
          <GripVertical size={16} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Task Title */}
          <h3
            className={`font-medium text-gray-900 text-sm leading-snug ${task.status === "DONE" ? "line-through text-gray-500" : ""}`}
          >
            {task.title}
          </h3>

          {/* Status Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
            >
              <Icon size={12} />
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
