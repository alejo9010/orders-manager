import { useSelector, useDispatch } from 'react-redux';
import OrderItem from '../components/OrderItem';
import { closeOrder, deleteOrder } from '../features/orders/orderSlice';
import { getServers, setStock } from '../features/servers/serverSlice';
import { findServerById } from '../helpers/utilities';
import Pagination from '../components/Pagination';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getOrders, OrderReset } from '../features/orders/orderSlice';
function Orders() {
  const { orders, isSuccess, isLoading, isError } = useSelector(
    (state) => state.orders
  );
  const { servers } = useSelector((state) => state.servers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getServers());
  }, []);
  const onCloseOrder = (id) => {
    dispatch(closeOrder(id));
    dispatch(OrderReset());
  };
  const onDeleteOrder = (order, server) => {
    const confirmDelete = window.confirm(
      'You really want to delete this order?'
    );
    if (confirmDelete) {
      dispatch(deleteOrder(order._id));
      const confirmReturnStock = window.confirm(
        'Want to add the stock back to the server?'
      );
      if (confirmReturnStock) {
        dispatch(
          setStock({ id: server._id, stock: server.stock + order.gold })
        );
      }
    }
  };
  const onOrderDetails = (orderId) => {
    navigate(orderId);
  };
  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-bar">f</div>
      </div>
      <div className="dashboard-table">
        <div className="header-row-5">
          <div>Game</div>
          <div>Server</div>
          <div>Name</div>
          <div>Gold</div>
          <div>Status</div>
        </div>

        {orders && (
          <Pagination
            ordersData={orders}
            serversData={servers}
            onCloseOrder={onCloseOrder}
            onOrderDetails={onOrderDetails}
            onDeleteOrder={onDeleteOrder}
          />
        )}
      </div>
    </main>
  );
}

export default Orders;
