import React, { useEffect, useState, ChangeEvent } from 'react';
import MainLayout from '../layouts/mainLayout';
import axios from 'axios';
import { Task } from '../types/Task';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { JwtService } from '../services/jwt.service';

const EditIcon = FiEdit2 as React.ComponentType<any>;
const DeleteIcon = FiTrash2 as React.ComponentType<any>;

const FilterPage: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Auth
  const token = localStorage.getItem('token')!;
  const userId = JwtService.getUserId(token);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get<Task[]>(`http://localhost:5254/task/Taches/user/${userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [userId]);

  // CRUD handlers
  const handleAdd = async (data: Partial<Task>) => {
    const res = await axios.post<Task>('http://localhost:5254/task/Taches', data, { headers: { 'Content-Type': 'application/json' } });
    setTasks(prev => [...prev, res.data]);
    window.dispatchEvent(new Event('taskChange'));
  };
  const handleUpdate = async (data: Partial<Task>) => {
    if (!data.idTache) return;
    await axios.put(`http://localhost:5254/task/Taches/${data.idTache}`, data, { headers: { 'Content-Type': 'application/json' } });
    setTasks(prev => prev.map(t => t.idTache === data.idTache ? { ...t, ...data } : t));
    setEditing(null);
    window.dispatchEvent(new Event('taskChange'));
  };
  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5254/task/Taches/${id}`);
    setTasks(prev => prev.filter(t => t.idTache !== id));
    window.dispatchEvent(new Event('taskChange'));
  };

  // Filter logic
  const filtered = tasks.filter(t => {
    if (search && !t.titre.toLowerCase().includes(search.toLowerCase())) return false;
    if (priority && t.priorite !== priority) return false;
    const due = new Date(t.dateEcheance!);
    if (startDate && due < new Date(startDate)) return false;
    if (endDate && due > new Date(endDate)) return false;
    return true;
  });

  const isOverdue = (d: string) => new Date(d).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  const isDone = (t: Task) => t.statut === 'Fait';

  const clearFilters = () => {
    setSearch('');
    setPriority('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <MainLayout>
      <div className="container py-5">
        <div className="mb-4">
          <h1 className="display-5">Filtrer & Rechercher</h1>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row gy-3 gx-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par titre..."
                  value={search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold">Priorité</label>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">Toutes</option>
                  <option value={1}>Urgent</option>
                  <option value={2}>Haut</option>
                  <option value={3}>Moyen</option>
                  <option value={4}>Faible</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold">De</label>
                <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold">À</label>
                <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>

              <div className="col-md-2 d-flex gap-2">
                <button className="btn btn-outline-secondary flex-fill" onClick={clearFilters}>
                  Effacer
                </button>
                <button className="btn btn-primary flex-fill" onClick={() => setShowAdd(true)}>
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="list-group">
            {filtered.map(t => (
              <div key={t.idTache} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div className={`fw-semibold mb-1 ${isDone(t) ? 'text-decoration-line-through' : isOverdue(t.dateEcheance!) ? 'text-danger' : ''}`}>{t.titre}</div>
                  <div>
                    <span className={`badge me-2 ${isDone(t) ? 'bg-success' : isOverdue(t.dateEcheance!) ? 'bg-danger' : 'bg-info'}`}> 
                      {isDone(t) ? 'Terminé' : isOverdue(t.dateEcheance!) ? 'En retard' : 'En cours'}
                    </span>
                    <span className="text-muted me-3">P{t.priorite}</span>
                    <span className={`me-3 ${isOverdue(t.dateEcheance!) ? 'text-danger' : ''}`}>{t.dateEcheance?.slice(8,10)}/{t.dateEcheance?.slice(5,7)}</span>
                    <small className="text-muted">{t.commentaire}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <EditIcon onClick={() => setEditing(t)} style={{ cursor: 'pointer' }} />
                  <DeleteIcon onClick={() => handleDelete(t.idTache!)} style={{ cursor: 'pointer' }} />
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-muted py-4">Aucune tâche trouvée</div>}
          </div>
        )}

        {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
        {editing && <EditTaskModal task={editing} onClose={() => setEditing(null)} onSave={handleUpdate} />}
      </div>
    </MainLayout>
  );
};

export default FilterPage;