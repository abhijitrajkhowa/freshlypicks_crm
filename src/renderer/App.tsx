import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';

import Home from '../../screens/Home/Home';
import Login from '../../screens/Login/Login';

export default function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}
