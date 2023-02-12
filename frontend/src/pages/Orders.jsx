import { useSelector, useDispatch } from 'react-redux';
import OrderItem from '../components/OrderItem';
import { closeOrder, deleteOrder } from '../features/orders/orderSlice';
import { getServers, setStock } from '../features/servers/serverSlice';
import { findServerById } from '../helpers/utilities';
import Pagination from '../components/Pagination';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getOrders, OrderReset } from '../features/orders/orderSlice';
import SpinnerInside from '../components/SpinnerInside';
function Orders() {
  const { orders, isSuccess, isLoading, isError } = useSelector((state) => state.orders);
  const { servers } = useSelector((state) => state.servers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getServers());
  }, []);
  useEffect(() => {
    if (isSuccess) {
      dispatch(OrderReset());
    }
  }, [isSuccess]);
  const onCloseOrder = (id) => {
    dispatch(closeOrder(id));
    dispatch(OrderReset());
  };
  const onDeleteOrder = (order, server) => {
    const confirmDelete = window.confirm('You really want to delete this order?');
    if (confirmDelete) {
      dispatch(deleteOrder(order._id));
      const confirmReturnStock = window.confirm('Want to add the stock back to the server?');
      if (confirmReturnStock) {
        dispatch(setStock({ id: server._id, stock: server.stock + order.gold }));
      }
    }
  };
  const onOrderDetails = (orderId) => {
    console.log(orderId);
    navigate(orderId);
  };
  return (
    <main className='dashboard-main'>
      <div className='dashboard-container'>
        <div className='dashboard-bar'></div>
      </div>
      <div className='dashboard-table'>
        <div className='header-row-5'>
          <div>Order#</div>

          <div>Game</div>
          <div>Server</div>
          <div>Name</div>
          <div>Gold</div>
          <div>Status</div>
        </div>

        {(isLoading && <SpinnerInside />) || (
          <Pagination>
            {orders.map((order) => {
              const serverOfOrder = findServerById(servers, order.server);
              if (serverOfOrder) {
                return (
                  <OrderItem
                    key={order._id}
                    server={serverOfOrder}
                    order={order}
                    onCloseOrder={onCloseOrder}
                    onDeleteOrder={onDeleteOrder}
                    onOrderDetails={onOrderDetails}
                  />
                );
              }
            })}
          </Pagination>
        )}
      </div>
    </main>
  );
}

export default Orders;
