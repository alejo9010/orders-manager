import React from 'react';
import { useState } from 'react';
import { FaCopy, FaCheck, FaTrash, FaEye } from 'react-icons/fa';

function OrderItemMobile({
  server,
  order,
  onCloseOrder,
  onOrderDetails,
  onDeleteOrder,
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

  return (
    <>
      <div
        className={`mobile-order-items ${
          markClosed && order.status === 'Closed' ? 'closed' : ''
        }`}
      >
        <h1 className="mobile-order-title">#{order.orderNumber}</h1>
        <div className="mobile-order-container">
          <div className="mobile-order">
            <div className="mobile-order-field-group">
              <h3>Game</h3>
              <h4>{server.gameName}</h4>
            </div>
            <div className="mobile-order-field-group">
              <h3>Server</h3>
              <h4>{server.serverName}</h4>
            </div>
          </div>
          <div className="mobile-order">
            <div className="mobile-order-field-group">
              <h3>Character</h3>
              <h4>
                {order.characterName}
                <button
                  onClick={onCopyName}
                  className="copy-btn-mobile order-name"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </h4>
            </div>
            <div className="mobile-order-field-group">
              <h3>Gold</h3>
              <h4>{order.gold}</h4>
            </div>
          </div>
          <div className="mobile-order">
            <button
              onClick={() => {
                if (order.status === 'Open') onCloseOrder(order._id);
              }}
              className={`status-${order.status}`}
            >
              {order.status}
            </button>
          </div>
          <div className="mobile-order-btns">
            <button
              className="delete-btn"
              onClick={() => onDeleteOrder(order, server)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderItemMobile;
