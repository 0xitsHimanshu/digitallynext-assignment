"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, ClipboardList, GripVertical } from "lucide-react";
import TaskColumn from "@/components/TaskColumn";

export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks from the API
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch {
      setError("Failed to load tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const addTask = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create task");
      }

      const data = await res.json();
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (
    taskId: string,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        fetchTasks();
        const data = await res.json();
        setError(data.error || "Failed to update task");
      }
    } catch {
      fetchTasks();
      setError("Failed to update task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      addTask();
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <div>
      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          Add New Task
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
            className="flex-1"
          />
          <Button onClick={addTask} disabled={isCreating || !title.trim()}>
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Task"
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingTasks ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500">Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ClipboardList size={48} className="mb-4" />
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm">Create your first task above to get started</p>
        </div>
      ) : (
        /* Task Columns with drag hint */
        <>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
          <GripVertical size={14} />
          <span>Drag and drop tasks between columns to update their status</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            status="TODO"
            tasks={todoTasks}
            onUpdateStatus={updateTaskStatus}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={inProgressTasks}
            onUpdateStatus={updateTaskStatus}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            tasks={doneTasks}
            onUpdateStatus={updateTaskStatus}
          />
        </div>
        </>
      )}
    </div>
  );
}
