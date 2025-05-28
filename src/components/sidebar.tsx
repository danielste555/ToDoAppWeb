import React, { useEffect, useState } from 'react';
import './styles/sidebar.css';
import AddTaskModal from './AddTaskModal';
import axios from 'axios';
import { Task } from '../types/Task';
import { JwtService } from '../services/jwt.service';
import { NavLink, useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [counts, setCounts] = useState({ today: 0, upcoming: 0, completed: 0 });
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userId = JwtService.getUserId(token);
  const userName  = JwtService.getUserName(token);
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      const res = await axios.get<Task[]>(`http://localhost:5254/task/Taches/user/${userId}`);
      const tasks = res.data;
      const todayDate = new Date();
      todayDate.setHours(0,0,0,0);
      const todayCount = tasks.filter(t => new Date(t.dateEcheance!).setHours(0,0,0,0) === todayDate.getTime() && t.statut !== 'Fait').length;
      const upcomingCount = tasks.filter(t => new Date(t.dateEcheance!).setHours(0,0,0,0) > todayDate.getTime() && t.statut !== 'Fait').length;
      const completedCount = tasks.filter(t => t.statut === 'Fait').length;
      setCounts({ today: todayCount, upcoming: upcomingCount, completed: completedCount });
    } catch (err) {
      console.error('Erreur fetchCounts', err);
    }
  };

// Listen to task change events triggered by other pages
useEffect(() => {
  window.addEventListener('taskChange', fetchCounts);
  return () => window.removeEventListener('taskChange', fetchCounts);
}, []);

useEffect(() => {
  fetchCounts();
}, [location]);

  useEffect(() => {
    fetchCounts();
  }, [location]);

  const handleAddTask = async (newTask: Partial<Task>) => {
    try {
      await axios.post('http://localhost:5254/task/Taches', newTask, { headers: { 'Content-Type': 'application/json' } });
      setShowModal(false);
      fetchCounts();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche', error);
    }
  };
   const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="profile"> <i className="fas fa-user-alt"></i> {userName}</div>
      <div className="add-task" onClick={() => setShowModal(true)}>+ Ajouter une tâche</div>

      <nav className="nav-links">
        <NavLink to="/filter" className="nav-link">🔍 <span>Recherche et Filtres</span></NavLink>
        <NavLink to="/today" end className="nav-link">📅 <span>Aujourd'hui</span><span className="count">{counts.today}</span></NavLink>
        <NavLink to="/upcoming" className="nav-link">📆 <span>Prochainement</span><span className="count">{counts.upcoming}</span></NavLink>
        <NavLink to="/completed" className="nav-link">✅ <span>Achevé</span><span className="count">{counts.completed}</span></NavLink>
      </nav>
      <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
       <button className="btn btn-outline-danger w-100 mt-auto mb-3" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
      </button>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onSave={handleAddTask} />}
    </div>
  );
};

export default Sidebar;
