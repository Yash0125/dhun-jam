import './App.css';
import React,{useState} from 'react';
import Login from './components/login/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (userToken) => {
    setToken(userToken);
  };
  return (
    <div>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AdminDashboard token={token} />
      )}
    </div>
  );
}

export default App;
