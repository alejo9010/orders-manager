import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, OrderReset } from '../features/orders/orderSlice';
import { getServer, reset, resetServer } from '../features/servers/serverSlice';
import { useEffect } from 'react';
import Spinner from '../components/SpinnerFixed';
function Order() {
  const { orderId } = useParams();
  const { server, isSuccess, isLoading } = useSelector(
    (state) => state.servers
  );
  //ORDER
  const { order, isOrderLoading, isOrderSuccess } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetServer());
    };
  }, []);
  useEffect(() => {
    dispatch(getOrder(orderId));
    console.log('2');
  }, []);

  useEffect(() => {
    if (isOrderSuccess) {
      dispatch(OrderReset());
      dispatch(getServer(order.server));
    }

    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, orderId, isOrderSuccess]);

  if (!server) return <Spinner />;
  return (
    <main className="dashboard-main">
      <div className="grid-cols-2">
        <div className="order-card">
          <h1 className="title">Order</h1>
          <hr />
          <p>Order Number: {order.orderNumber}</p>
          <p>Profit: ${order.profit}</p>
          <p>Gold: {order.gold}</p>
          <p>Buyer: {order.buyerName}</p>
          <p>Character Name: {order.characterName}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
          <p className={`order-${order.status}`}>Status: {order.status}</p>
        </div>
        <div>
          <div className="order-card">
            <h1 className="title">Server</h1>
            <hr />
            <p>Server name: {server.serverName}</p>
            <p>Game name: {server.gameName}</p>
            <p>Stock: {server.stock}</p>
            <p>Exist: {server.isHidden.toString()}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Order;
