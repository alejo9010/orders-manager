import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithDashboard from './components/WithDashboard.jsx';
import WithoutDashbord from './components/WithoutDashbord';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders.jsx';
import OrdersToday from './pages/OrdersToday.jsx';
import Resume from './pages/Resume.jsx';
import Expenses from './pages/Expenses.jsx';
import Servers from './pages/Servers.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<WithDashboard />}>
              <Route path="/" element={<OrdersToday />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/servers" element={<Servers />} />
            </Route>
          </Route>
          <Route element={<WithoutDashbord />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        autoClose={3000}
        pauseOnFocusLoss={false}
        closeOnClick
        pauseOnHover={false}
      />
    </>
  );
}

export default App;
