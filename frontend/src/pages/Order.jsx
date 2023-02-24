import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, OrderReset } from '../features/orders/orderSlice';
import { getServer, reset } from '../features/servers/serverSlice';
import { useEffect, useState } from 'react';
import Spinner from '../components/SpinnerFixed';
function Order() {
  const { orderId } = useParams();
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [serverLoaded, setServerLoaded] = useState(false);
  const { server, isSuccess, isLoading } = useSelector((state) => state.servers);
  const {
    order,
    isSuccess: isOrderSuccess,
    isLoading: isOrderLoading,
  } = useSelector((state) => state.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    let ignore = false;
    //Get order if not in the state
    if (!orderLoaded && !ignore) {
      dispatch(getOrder(orderId));
    }
    //Then load server if theres an order
    if (orderLoaded) {
      dispatch(getServer(order.server));
    }

    return () => {
      ignore = true;
    };
  }, [orderLoaded, serverLoaded, dispatch, orderId, order?.server]);

  useEffect(() => {
    //Reset after order success
    if (isOrderSuccess) {
      dispatch(OrderReset());
      setOrderLoaded(true);
    }
    //reset after server success
    if (isSuccess) {
      dispatch(reset());
      setServerLoaded(true);
    }
  }, [isOrderSuccess, isSuccess, dispatch]);

  if (isLoading || isOrderLoading || !serverLoaded) {
    return <Spinner />;
  }
  return (
    <main className='dashboard-main'>
      <div className='grid-cols-2'>
        <div className='order-card'>
          <h1 className='title'>Order</h1>
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
          <div className='order-card'>
            <h1 className='title'>Server</h1>
            <hr />
            <p>Server name: {server?.serverName}</p>
            <p>Game name: {server?.gameName}</p>
            <p>Stock: {server?.stock}</p>
            <p>Exist: {server?.isHidden.toString()}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Order;
