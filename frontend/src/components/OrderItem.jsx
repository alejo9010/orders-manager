import React, { useEffect } from 'react';
import { FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { hideServer, setStock, reset } from '../features/servers/serverSlice';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerSmall from './SpinnerSmall';
import SpinnerFixed from './SpinnerFixed';
import { FaCopy, FaCheck } from 'react-icons/fa';

function OrderItem({ server, order, onCloseOrder }) {
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
    <div className="row-5">
      <div className="">{server.gameName}</div>
      <div className="">{server.serverName}</div>
      <div className="order-name column-character-name">
        <span>{order.characterName}</span>
        <button onClick={onCopyName} className="copy-btn order-name">
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      <div className="">{order.gold}</div>
      <button
        onClick={() => {
          if (order.status === 'Open') onCloseOrder(order._id);
        }}
        className={`status-${order.status}`}
      >
        {order.status}
      </button>
    </div>
  );
}

export default OrderItem;
