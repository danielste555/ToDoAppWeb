import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TodayPage from './pages/TodayPage';
import UpcomingPage from './pages/UpcomingPage';
import CompletedPage from './pages/CompletedPage';
import FilterPage from './pages/FilterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage/>} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/today' element={<TodayPage/>} />
          <Route path='/upcoming' element={<UpcomingPage/>} />
          <Route path='/completed' element={<CompletedPage/>} />
          <Route path='/filter' element={<FilterPage/>} /> 
        </Route>
         {/* Redirect par défaut */}
        <Route path="*" element={<LoginPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
