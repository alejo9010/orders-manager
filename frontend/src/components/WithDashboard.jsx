import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import iconGoblin from '../assets/goblin.svg';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import {
  FaCalendarDay,
  FaList,
  FaWallet,
  FaSuitcase,
  FaShoppingCart,
  FaServer,
  FaUserAlt,
  FaChartBar,
} from 'react-icons/fa';
function WithDashboard() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };
  return (
    <>
      <div className="container bg-dashboard">
        <div className="dashboard">
          <div className="dashboard-header">
            <div className="header-logo">
              <img className="logo" src={iconGoblin} alt="" />
            </div>
            <div className="dashboard-header-btns">
              <p className="user-mail">
                <FaUserAlt />
                {user?.name}
              </p>

              <button className="btn-header" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
          <div className="dashboard-sidenav">
            <Link
              to="/"
              className={`btn-sidenav ${pathname === '/' && 'active'}`}
              onClick={(e) => setPathname('/')}
            >
              <FaCalendarDay />
              <p className="sidebar-name">Today</p>
            </Link>
            <Link
              to="/orders"
              className={`btn-sidenav ${pathname === '/orders' && 'active'}`}
              onClick={(e) => setPathname('/orders')}
            >
              <FaShoppingCart />
              <p className="sidebar-name">Orders</p>
            </Link>
            <Link
              to="/servers"
              className={`btn-sidenav ${pathname === '/servers' && 'active'}`}
              onClick={(e) => setPathname('/servers')}
            >
              <FaServer />

              <p className="sidebar-name">Servers</p>
            </Link>
            <Link
              to="/expenses"
              className={`btn-sidenav ${pathname === '/expenses' && 'active'}`}
              onClick={(e) => setPathname('/expenses')}
            >
              <FaWallet />
              <p className="sidebar-name">Expenses</p>
            </Link>
            <Link
              to="/report"
              className={`btn-sidenav ${pathname === '/report' && 'active'}`}
              onClick={(e) => setPathname('/report')}
            >
              <FaChartBar />
              <p className="sidebar-name">Reports</p>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default WithDashboard;
