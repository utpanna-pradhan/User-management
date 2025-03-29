
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Users from './components/Users';

function App() {
  const token = localStorage.getItem('token');
  return (
    <div className="App bg-light">
  <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={token ? <Users /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
