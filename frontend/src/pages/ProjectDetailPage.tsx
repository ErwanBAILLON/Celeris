import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, ProjectDetail } from '../services/project/projectService';
import { getTasks, createTask, deleteTask, Task } from '../services/task/taskService';
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (!project) {
    return <p className="text-center text-red-500">Project not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/projects" className="text-blue-600 hover:underline mb-4 inline-block">
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
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Task
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">New Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-3">
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
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {taskLoading
          ? <p>Loading tasks...</p>
          : (
            <ul className="space-y-2">
              {tasks.map(t => (
                <li
                  key={t.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded shadow-sm"
                >
                  <span>{t.name}</span>
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
      </section>
    </div>
  );
};

export default ProjectDetailPage;
