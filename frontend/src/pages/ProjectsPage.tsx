import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes } from '../utils/routes';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { deleteProject, updateProject } from '../services/project/projectService';

interface Project { id: string; name: string; }

const ProjectsPage: React.FC = () => {
  const token = useUserStore(state => state.user.accessToken);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteProject(id, token);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setEditName(proj.name);
    setEditDescription((proj as any).description || '');
    setEditStartDate((proj as any).startDate?.slice(0,16) || '');
    setEditEndDate((proj as any).endDate?.slice(0,16) || '');
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;
    const payload = {
      name: editName,
      description: editDescription,
      startDate: new Date(editStartDate).toISOString(),
      endDate: new Date(editEndDate).toISOString(),
    };
    const updated = await updateProject(editingProject.id, payload, token);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const resp = await axios.get<Project[]>(Routes.GET_PROJECTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <Link
          to="/projects/new"
          className="mt-4 md:mt-0 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Project
        </Link>
      </header>

      {loading
        ? <div className="flex justify-center items-center h-64"><span>Loading...</span></div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <div key={p.id} className="relative bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <Link to={`/projects/${p.id}`}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{p.name}</h2>
                  <p className="text-sm text-gray-500">View details &rarr;</p>
                </Link>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md z-60">
            <h3 className="text-xl font-semibold mb-4">Edit Project</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Name"
                required
              />
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder="Description"
              />
              <div className="flex gap-2">
                <label className="flex-1 flex flex-col text-sm">
                  Start Date
                  <input
                    type="datetime-local"
                    value={editStartDate}
                    onChange={e => setEditStartDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                </label>
                <label className="flex-1 flex flex-col text-sm">
                  End Date
                  <input
                    type="datetime-local"
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
