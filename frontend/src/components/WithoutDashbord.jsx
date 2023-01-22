import { Outlet } from 'react-router';

function WithoutDashbord() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

export default WithoutDashbord;
