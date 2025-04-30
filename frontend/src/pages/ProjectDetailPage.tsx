import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, ProjectDetail } from '../services/project/projectService';
import { getTasks, createTask, deleteTask, updateTask, Task } from '../services/task/taskService';
import { useUserStore } from '../store/userStore';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // nouveau state pour les tâches
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLoading, setTaskLoading] = useState(false);

  // nouveau state pour le formulaire de création de tâche
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('in progress');
  const [priority, setPriority] = useState('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const token = useUserStore(s => s.user.accessToken);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) return;
    const newTask = await createTask(
      id,
      { name, description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status, priority },
      token
    );
    setTasks(prev => [...prev, newTask]);
    handleCloseModal();
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setName(task.name);
    setDescription(task.description);
    setStartDate(task.startDate.slice(0,16));
    setEndDate(task.endDate.slice(0,16));
    setStatus(task.status);
    setPriority(task.priority);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) return;
    const payload = {
      name, description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status, priority
    };
    if (isEditing && editingTask) {
      const updated = await updateTask(id, editingTask.id, payload, token);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      const newTask = await createTask(id, payload, token);
      setTasks(prev => [...prev, newTask]);
    }
    setIsEditing(false);
    setEditingTask(null);
    handleCloseModal();
  };

  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      try {
        const data = await getProjectById(id, token);
        setProject(data);
      } catch {
        // ...
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  // fetch tasks
  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      setTaskLoading(true);
      try {
        const list = await getTasks(id, token);
        setTasks(list);
      } catch {
        // ...
      } finally {
        setTaskLoading(false);
      }
    })();
  }, [id, token]);

  const handleDeleteTask = async (taskId: string) => {
    if (!id || !token) return;
    try {
      await deleteTask(id, taskId, token);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch {
      // ...
    }
  };

  const now = new Date();

  // grouper tâches par date (YYYY-MM-DD)
  const tasksByDate: Record<string, Task[]> = tasks
    .filter(t => t.startDate)
    .reduce((acc, t) => {
      const day = new Date(t.startDate).toISOString().split('T')[0];
      acc[day] = acc[day] ? [...acc[day], t] : [t];
      return acc;
    }, {} as Record<string, Task[]>);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (!project) {
    return <p className="text-center text-red-500">Project not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/home" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to projects
      </Link>
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <div className="space-y-1 text-sm text-gray-600 mb-8">
        <div>Start: {new Date(project.startDate).toLocaleString()}</div>
        <div>End: {new Date(project.endDate).toLocaleString()}</div>
      </div>

      {/* Tasks Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <button onClick={handleOpenModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Add Task
          </button>
        </div>

        {/* Modal (en création ou édition) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md z-60">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Task' : 'New Task'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text" placeholder="Name"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 border rounded h-20"
                  required
                />
                <div className="flex gap-2">
                  <label className="flex-1 flex flex-col text-sm">
                    Start
                    <input
                      type="datetime-local"
                      value={startDate} onChange={e => setStartDate(e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </label>
                  <label className="flex-1 flex flex-col text-sm">
                    End
                    <input
                      type="datetime-local"
                      value={endDate} onChange={e => setEndDate(e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <select
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select
                    value={priority} onChange={e => setPriority(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setEditingTask(null); handleCloseModal(); }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Planning Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Planning</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tasksByDate).map(([day, dayTasks]) => (
            <div key={day} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2">
                {new Date(day).toLocaleDateString(undefined, {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </div>
              <div className="p-4 space-y-4">
                {dayTasks.map(task => {
                  const s = new Date(task.startDate);
                  const e = new Date(task.endDate);
                  const startTime = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endTime   = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const fullEndDate  = e.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  const isOverdue    = e < now && task.status !== 'completed';
                  const isInProgress = s <= now && now <= e;

                  let priorityClass = 'bg-gray-200 text-gray-800';
                  if (task.priority === 'high')   priorityClass = 'bg-red-200 text-red-800';
                  if (task.priority === 'medium') priorityClass = 'bg-yellow-200 text-yellow-800';
                  if (task.priority === 'low')    priorityClass = 'bg-green-200 text-green-800';

                  return (
                    <div key={task.id} className="relative border p-3 rounded">
                      {/* actions */}
                      <div className="absolute top-2 right-2 flex space-x-2 z-10">
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="font-semibold text-gray-800">{task.name}</p>
                      <p className="text-sm text-gray-600">Date de fin : {fullEndDate}</p>
                      <p className="text-sm text-gray-600 mb-1">Horaires : de {startTime} à {endTime}</p>
                      <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${priorityClass}`}>{task.priority}</span>
                        <span className="px-2 py-1 rounded bg-blue-200 text-blue-800">{task.status}</span>
                        {isInProgress && (
                          <span className="px-2 py-1 rounded bg-green-200 text-green-800">En cours</span>
                        )}
                        {isOverdue && (
                          <span className="px-2 py-1 rounded bg-red-200 text-red-800">Dépassé</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
