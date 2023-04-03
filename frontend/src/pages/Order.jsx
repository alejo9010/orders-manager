import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, OrderReset } from '../features/orders/orderSlice';
import { useEffect } from 'react';
import Spinner from '../components/SpinnerFixed';
function Order() {
  const { orderId } = useParams();
  const { order, isSuccess, isLoading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  console.log(isLoading);
  useEffect(() => {
    dispatch(getOrder(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(OrderReset());
    }
  }, [isSuccess, dispatch]);

  if (isLoading || !order) {
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
            <p>Server name: {order.server?.serverName}</p>
            <p>Game name: {order.server?.gameName}</p>
            <p>Stock: {order.server?.stock}</p>
            <p>Exist: {order.server?.isHidden.toString()}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Order;
