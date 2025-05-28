import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/mainLayout';
import axios from 'axios';
import { Task } from '../types/Task';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { JwtService } from '../services/jwt.service';


const EditIcon = FiEdit2 as React.ComponentType<any>;
const DeleteIcon = FiTrash2 as React.ComponentType<any>;

const UpcomingPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const token = localStorage.getItem('token');
  const id_user = JwtService.getUserId(token);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get<Task[]>(`http://localhost:5254/task/Taches/user/${id_user}`);
        // Only keep non-done tasks
        setTasks(res.data.filter(t => t.statut !== 'Fait'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handler utilities
  const handleAdd = async (newTask: Partial<Task>) => {
    try {
      const res = await axios.post<Task>('http://localhost:5254/task/Taches', newTask, { headers: { 'Content-Type': 'application/json' } });
      setTasks(prev => [...prev, res.data]);
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5254/task/Taches/${id}`);
      setTasks(prev => prev.filter(t => t.idTache !== id));
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };
  const handleSaveEdit = async (updated: Partial<Task>) => {
    try {
      await axios.put(`http://localhost:5254/task/Taches/${updated.idTache}`, updated, { headers: { 'Content-Type': 'application/json' } });
      setTasks(prev => prev.map(t => t.idTache === updated.idTache ? { ...t, ...updated } : t));
      setEditingTask(null);
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };
  const handleToggleDone = async (task: Task) => {
    try {
      const updated = { ...task, statut: 'Fait' };
      await axios.put(`http://localhost:5254/task/Taches/${task.idTache}`, updated, { headers: { 'Content-Type': 'application/json' } });
      setTasks(prev => prev.filter(t => t.idTache !== task.idTache));
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };

  // Determine upcoming tasks (date > today)
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = tasks.filter(t => {
    const d = new Date(t.dateEcheance!);
    d.setHours(0,0,0,0);
    return d.getTime() > today.getTime();
  }).sort((a,b) => new Date(a.dateEcheance!).getTime() - new Date(b.dateEcheance!).getTime());

  return (
    <MainLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Prochainement</h1>
          <span className="badge bg-info">⏳ {upcoming.length} tâche{upcoming.length>1?'s':''}</span>
        </div>

        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="list-group">
            {upcoming.map(task => (
              <div key={task.idTache} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <input type="checkbox" className="form-check-input" onChange={() => handleToggleDone(task)} />
                  <div>
                    <div className="fw-semibold">{task.titre}</div>
                    <small className="text-muted">{task.commentaire || 'Sans commentaire'}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-secondary me-3">{task.dateEcheance?.slice(8,10)}/{task.dateEcheance?.slice(5,7)}</small>
                  <EditIcon onClick={()=>setEditingTask(task)} style={{cursor:'pointer'}} />
                  <DeleteIcon onClick={()=>handleDelete(task.idTache!)} style={{cursor:'pointer'}} />
                </div>
              </div>
            ))}
            <button className="list-group-item list-group-item-action text-primary text-start" onClick={()=>setShowAddModal(true)}>
              + Ajouter une tâche
            </button>
          </div>
        )}

        {showAddModal && <AddTaskModal onClose={()=>setShowAddModal(false)} onSave={handleAdd} />}
        {editingTask && <EditTaskModal task={editingTask} onClose={()=>setEditingTask(null)} onSave={handleSaveEdit} />}
      </div>
    </MainLayout>
  );
};

export default UpcomingPage;
