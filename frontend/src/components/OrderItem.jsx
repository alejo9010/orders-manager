import React from 'react';
import { useState } from 'react';
import { FaCopy, FaCheck, FaTrash, FaEye } from 'react-icons/fa';

function OrderItem({
  server,
  order,
  onCloseOrder,
  onOrderDetails,
  onDeleteOrder,
  showOrderNum,
  markClosed,
}) {
  const [copied, setCopied] = useState(false);
  const onCopyName = async (e) => {
    if (!copied) {
      setCopied(true);
      await navigator.clipboard.writeText(order.characterName);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };
  console.log(order);
  console.log(server);
  return (
    <div className={`row-5 ${markClosed && order.status === 'Closed' ? 'closed' : ''}`}>
      <div className='icon-group-abs'>
        {onOrderDetails && (
          <button className='details-btn' onClick={() => onOrderDetails(order._id)}>
            <FaEye />
          </button>
        )}
        {onDeleteOrder && (
          <button className='delete-btn' onClick={() => onDeleteOrder(order, server)}>
            <FaTrash />
          </button>
        )}
      </div>
      <div className=''>{order.orderNumber}</div>
      <div className=''>{server.gameName.substring(0, 10)}..</div>
      <div className=''>{server.serverName.substring(0, 19)}..</div>
      <div className='order-name column-character-name'>
        <span>{order.characterName}</span>
        <button onClick={onCopyName} className='copy-btn order-name'>
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      <div className=''>{showOrderNum ? order.orderNumber : order.gold}</div>
      {onCloseOrder && (
        <button
          onClick={() => {
            if (order.status === 'Open') onCloseOrder(order._id);
          }}
          className={`status-${order.status}`}>
          {order.status}
        </button>
      )}
    </div>
  );
}

export default OrderItem;
