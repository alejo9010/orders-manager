import Spinner from '../components/SpinnerInside';
import OrderItem from '../components/OrderItem';
import OrderItemMobile from '../components/OrderItemMobile';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import mediaQueries from '../configs/mediaQueries';
import { useSelector, useDispatch } from 'react-redux';
import { getServers, setStock } from '../features/servers/serverSlice';
import { createOrder, getOrders, closeOrder, deleteOrder } from '../features/orders/orderSlice';
import { OrderReset } from '../features/orders/orderSlice';
import { reset } from '../features/servers/serverSlice';
import { FaPaste } from 'react-icons/fa';
import Modal from 'react-modal';
import { isCurrentDay, findServerById, numberWithCommas } from '../helpers/utilities';
import { toast } from 'react-toastify';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    heigth: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'visible',
  },
};

Modal.setAppElement('#root');
function OrdersToday() {
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [serverStock, setServerStock] = useState(null);
  const formInitialState = {
    server: '',
    orderNumber: '',
    profit: '',
    gold: '',
    characterName: '',
    buyerName: '',
  };
  const initDaySummary = {
    totalOrders: 0,
    totalProfit: 0,
    totalGold: 0,
    AvgGoldPrice: 0,
  };

  const [orderData, setOrderData] = useState({ ...formInitialState });
  const [daySummary, setDaySummary] = useState({ ...initDaySummary });

  const { totalOrders, totalProfit, totalGold, AvgGoldPrice } = daySummary;
  const { server, orderNumber, profit, gold, characterName, buyerName } = orderData;
  const dispatch = useDispatch();
  const {
    servers,
    isSuccess: serverIsSuccess,
    isLoading: serverIsLoading,
    isError: serverIsError,
    message: serverMessage,
    stockIsLoading,
  } = useSelector((state) => state.servers);
  const { orders, isLoading, isError, isSuccess, message } = useSelector((state) => state.orders);
  useEffect(() => {
    if (isSuccess) {
      dispatch(OrderReset());
    }

    if (isError) {
      toast.error(message);
      dispatch(OrderReset());
    }
    if (serverIsError) {
      dispatch(OrderReset());
    }

    if (serverIsSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, serverIsSuccess]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      dispatch(getServers());
      dispatch(getOrders());
    }
    return () => {
      ignore = true;
    };
  }, []);
  useEffect(() => {
    createDaySummary();
  }, [orders, stockIsLoading]);

  const createDaySummary = () => {
    const todayOrders = orders.filter((order) => isCurrentDay(new Date(order.createdAt)));
    const totalOrders = todayOrders.length;
    const totalProfit = todayOrders.reduce((acc, curr) => acc + curr.profit, 0);
    const goldSold = todayOrders.reduce((acc, curr) => acc + curr.gold, 0);
    const goldInStock = servers
      .filter((server) => !server.isHidden)
      .reduce((acc, curr) => acc + curr.stock, 0);
    const totalGold = `${numberWithCommas(goldSold)} / ${numberWithCommas(goldSold + goldInStock)}`;
    let AvgGoldPrice = Number.parseFloat(totalProfit / goldSold).toFixed(5);
    if (isNaN(AvgGoldPrice)) AvgGoldPrice = 0;
    setDaySummary({ totalOrders, totalProfit, totalGold, AvgGoldPrice });
  };

  const onChange = (e) => {
    if (e.target.name === 'server') {
      const serverExist = servers.filter((s) => s._id === e.target.value)[0];
      if (serverExist) {
        setServerStock(serverExist.stock);
        setOrderData((prevState) => ({ ...prevState, server: e.target.value }));
      }
    }
    setOrderData((state) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };

  const onPaste = async () => {
    //read clipboard
    const clipboardText = await navigator.clipboard.readText();

    //set all lines into an array
    const lines = clipboardText.split('\r\n');
    const text =
      lines[lines.findIndex((string) => string.includes('CHARACTER NAME '))].substring(15);
    //Get data sort from lines
    if (lines.length > 20) {
      const pasteOrder = {
        server: lines[lines.findIndex((string) => string.includes('SERVER '))].substring(7),
        orderNumber:
          lines[lines.findIndex((string) => string.includes('SOLD ORDER №'))].substring(12),
        profit: +lines[lines.indexOf(' Sold Details') + 7].split(' ')[1].substring(1),
        gold: +lines[lines.indexOf(' Sold Details') + 6]
          .replaceAll('\t', ' ')
          .split(' ')[0]
          .replaceAll(',', ''),
        characterName:
          lines[lines.findIndex((string) => string.includes('CHARACTER NAME '))].substring(15),
        buyerName: lines[lines.indexOf('BUYER') - 1].trim(),
      };
      const serverExist = servers.filter(
        (s) => s.serverName === pasteOrder.server && s.isHidden === false
      )[0];
      if (serverExist) {
        pasteOrder.server = serverExist._id;
        setServerStock(serverExist.stock);
        setOrderData(pasteOrder);
      } else {
        toast.error(`${pasteOrder.server} do not exist`);
      }
    } else {
      toast.error('Wrong data in clipboard');
    }
  };

  const onCloseOrder = (id) => {
    dispatch(closeOrder(id));
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
  const onOrderSubmit = (e) => {
    e.preventDefault();
    const orderExists = orders.filter((order) => order.orderNumber === orderNumber);
    if (isNaN(profit) || isNaN(gold)) {
      toast.error('Profit and gold should be numbers');
    } else if (gold > serverStock) {
      toast.error('Server do not have enought stock');
    } else if (orderExists.length > 0) {
      toast.error(`Order ${orderNumber} exists already`);
    } else {
      dispatch(createOrder(orderData));
      dispatch(setStock({ id: orderData.server, stock: serverStock - orderData.gold }));
      setOrderData({ ...formInitialState });
      setServerStock(null);
      setModalIsOpen(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };
  return (
    <main className='dashboard-main'>
      <div className='dashboard-container'>
        <div className='dashboard-bar'>
          <div className='d-flex-100'>
            <div className='d-flex'>
              <span className='info-viewer'>Orders: {totalOrders}</span>
              <span className='info-viewer'>Profit: {totalProfit.toFixed(2)}</span>
              <span className='info-viewer'>Gold sold: {totalGold}</span>
              <span className='info-viewer'>Avg: {AvgGoldPrice}</span>
            </div>
            <button className='btn-round' onClick={() => setModalIsOpen(true)}>
              New Order
            </button>
          </div>
          <div className='p-relative'>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
              <form className='form ' action='' onSubmit={onOrderSubmit}>
                <div className='form-group'>
                  <h1 className='form-header'>
                    New Order
                    <button
                      type='button'
                      onClick={onPaste}
                      className='btn btn-sm p-absolute p-topright'>
                      <FaPaste className='paste-icon' />
                    </button>
                  </h1>

                  <select
                    type='text'
                    placeholder='Server'
                    name='server'
                    onChange={onChange}
                    required
                    value={server}>
                    <option value='' disabled={true}>
                      Select Server
                    </option>
                    {servers.map(
                      (server) =>
                        !server.isHidden && (
                          <option key={server._id} value={server._id} stock={server.stock}>
                            {server.serverName}
                          </option>
                        )
                    )}
                  </select>
                  {serverStock !== null && serverStock > -1 ? <p>Stock: {serverStock}</p> : ''}

                  <input
                    type='text'
                    placeholder='Order #'
                    name='orderNumber'
                    value={orderNumber}
                    onChange={onChange}
                    required
                  />
                  <input
                    type='text'
                    placeholder='Profit'
                    name='profit'
                    value={profit}
                    onChange={onChange}
                    required
                  />
                  <input
                    type='text'
                    placeholder='Gold'
                    name='gold'
                    value={gold}
                    onChange={onChange}
                    required
                  />
                  <input
                    type='text'
                    placeholder='Character Name'
                    name='characterName'
                    value={characterName}
                    onChange={onChange}
                    required
                  />
                  <input
                    type='text'
                    placeholder='Buyer Name'
                    name='buyerName'
                    value={buyerName}
                    onChange={onChange}
                    required
                  />
                  <button className='btn'>Submit</button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
      <div className='dashboard-table'>
        {(!isMobile && (
          <>
            <div className='header-row-5'>
              <div>Order</div>
              <div>Game</div>
              <div>Server</div>
              <div>Name</div>
              <div>Gold</div>
              <div>Status</div>
            </div>

            {((isLoading || serverIsError) && <Spinner />) ||
              orders.map((order) => {
                const serverOfOrder = findServerById(servers, order.server);
                if (isCurrentDay(new Date(order.createdAt)) && serverOfOrder) {
                  return (
                    <OrderItem
                      key={order._id}
                      server={serverOfOrder}
                      order={order}
                      onCloseOrder={onCloseOrder}
                      markClosed={true}
                      onDeleteOrder={onDeleteOrder}
                    />
                  );
                }
              })}
          </>
        )) ||
          ((isLoading || serverIsError) && <Spinner />) ||
          orders.map((order) => {
            const serverOfOrder = findServerById(servers, order.server);
            if (isCurrentDay(new Date(order.createdAt)) && serverOfOrder) {
              return (
                <OrderItemMobile
                  key={order._id}
                  server={serverOfOrder}
                  order={order}
                  onCloseOrder={onCloseOrder}
                  onDeleteOrder={onDeleteOrder}
                  markClosed={true}
                />
              );
            }
          })}
      </div>
    </main>
  );
}

export default OrdersToday;
