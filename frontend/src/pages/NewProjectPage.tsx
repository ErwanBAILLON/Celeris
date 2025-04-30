import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/project/projectService';
import { useUserStore } from '../store/userStore';

const NewProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useUserStore(state => state.user.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!description.trim() || !startDate || !endDate) {
      setError('All fields are required');
      return;
    }
    if (!token) {
      setError('Authentication required');
      return;
    }
    try {
      setLoading(true);
      const project = await createProject(
        {
          name,
          description,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
        token
      );
      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="p-2 border rounded h-24"
        />
        <label>
          Start Date
          <input
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </label>
        <label>
          End Date
          <input
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default NewProjectPage;
