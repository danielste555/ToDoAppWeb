import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/mainLayout';
import axios from 'axios';
import { Task } from '../types/Task';
import EditTaskModal from '../components/EditTaskModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { JwtService } from '../services/jwt.service';

const EditIcon = FiEdit2 as React.ComponentType<any>;
const DeleteIcon = FiTrash2 as React.ComponentType<any>;

const CompletedPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const token = localStorage.getItem('token');
  const id_user = JwtService.getUserId(token);;

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await axios.get<Task[]>(`http://localhost:5254/task/Taches/user/${id_user}`);
        // Keep only tasks with statut 'Fait'
        const done = res.data.filter(t => t.statut === 'Fait');
        // Sort by completion date or due date asc
        done.sort((a,b) => new Date(a.dateEcheance!).getTime() - new Date(b.dateEcheance!).getTime());
        setTasks(done);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5254/task/Taches/${id}`);
      setTasks(prev => prev.filter(t => t.idTache !== id));
      window.dispatchEvent(new Event('taskChange'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndone = async (task: Task) => {
    try {
      const updated = { ...task, statut: 'À faire' };
      await axios.put(`http://localhost:5254/task/Taches/${task.idTache}`, updated, {
        headers: { 'Content-Type': 'application/json' }
      });
      setTasks(prev => prev.filter(t => t.idTache !== task.idTache));
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (updated: Partial<Task>) => {
    try {
      await axios.put(`http://localhost:5254/task/Taches/${updated.idTache}`, updated, {
        headers: { 'Content-Type': 'application/json' }
      });
      setTasks(prev => prev.map(t => t.idTache === updated.idTache ? { ...t, ...updated } : t));
      setEditingTask(null);
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Terminées</h1>
          <span className="badge bg-secondary">✔️ {tasks.length} tâche{tasks.length>1?'s':''}</span>
        </div>

        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="list-group">
            {tasks.map(task => (
              <div key={task.idTache} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={true}
                    onChange={() => handleUndone(task)}
                  />
                  <div>
                    <div className="fw-semibold text-decoration-line-through">{task.titre}</div>
                    <small className="text-muted">{task.commentaire || 'Sans commentaire'}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-secondary me-3">{task.dateEcheance?.slice(8,10)}/{task.dateEcheance?.slice(5,7)}</small>
                  <EditIcon onClick={() => setEditingTask(task)} style={{ cursor: 'pointer' }} />
                  <DeleteIcon onClick={() => handleDelete(task.idTache!)} style={{ cursor: 'pointer' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CompletedPage;
