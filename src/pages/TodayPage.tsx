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

const TodayPage: React.FC = () => {
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

  // Add
  const handleAdd = async (newTask: Partial<Task>) => {
    try {
      const res = await axios.post<Task>('http://localhost:5254/task/Taches', newTask, {
        headers: { 'Content-Type': 'application/json' }
      });
      setTasks(prev => [...prev, res.data]);
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5254/task/Taches/${id}`);
      setTasks(prev => prev.filter(t => t.idTache !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Save Edit
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

  // Toggle Done status
  const handleToggleDone = async (task: Task) => {
    try {
      const updated = { ...task, statut: 'Fait' };
      await axios.put(`http://localhost:5254/task/Taches/${task.idTache}`, updated, {
        headers: { 'Content-Type': 'application/json' }
      });
      // remove from list
      setTasks(prev => prev.filter(t => t.idTache !== task.idTache));
      window.dispatchEvent(new Event('taskChange'));

    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const isSameDay = (d: string) => { const dt=new Date(d); dt.setHours(0,0,0,0); return dt.getTime() === today.getTime(); };
  const overdue = tasks.filter(t => new Date(t.dateEcheance!).setHours(0,0,0,0) < today.getTime());
  const todayTasks = tasks.filter(t => t.statut !== 'Fait' && t.dateEcheance && isSameDay(t.dateEcheance));


  return (
    <MainLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Aujourd'hui</h1>
          <span className="badge bg-success">✅ {todayTasks.length} tâche{todayTasks.length>1?'s':''}</span>
        </div>

        {loading ? <div>Chargement...</div> : (
          <>
            {overdue.length>0 && (
              <div className="mb-4">
                <h5 className="text-danger">En retard</h5>
                <div className="list-group mb-3">
                  {overdue.map(t=> (
                    <div key={t.idTache} className="list-group-item d-flex justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() => handleToggleDone(t)}
                        />
                        <div>
                          <div className="fw-semibold">{t.titre}</div>
                          <small className="text-muted">{t.commentaire||'Sans commentaire'}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-danger me-3">{t.dateEcheance?.slice(8,10)}/{t.dateEcheance?.slice(5,7)}</small>
                        <EditIcon onClick={()=>setEditingTask(t)} style={{cursor:'pointer'}} />
                        <DeleteIcon onClick={()=>handleDelete(t.idTache!)} style={{cursor:'pointer'}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h5>Aujourd'hui</h5>
              <div className="list-group">
                {todayTasks.map(t=> (
                  <div key={t.idTache} className="list-group-item d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleToggleDone(t)}
                      />
                      <div>
                        <div className="fw-semibold">{t.titre}</div>
                        <small className="text-muted">{t.commentaire||'Sans commentaire'}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-secondary me-3">{t.dateEcheance?.slice(8,10)}/{t.dateEcheance?.slice(5,7)}</small>
                      <EditIcon onClick={()=>setEditingTask(t)} style={{cursor:'pointer'}} />
                      <DeleteIcon onClick={()=>handleDelete(t.idTache!)} style={{cursor:'pointer'}} />
                    </div>
                  </div>
                ))}
                <button className="list-group-item list-group-item-action text-danger text-start" onClick={()=>setShowAddModal(true)}>+ Ajouter une tâche</button>
              </div>
            </div>
          </>
        )}

        {showAddModal && <AddTaskModal onClose={()=>setShowAddModal(false)} onSave={handleAdd} />}
        {editingTask && <EditTaskModal task={editingTask} onClose={()=>setEditingTask(null)} onSave={handleSaveEdit}/>}    
      </div>
    </MainLayout>
  );
};

export default TodayPage;
