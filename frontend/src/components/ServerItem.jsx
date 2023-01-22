import React, { useEffect } from 'react';
import { FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { hideServer, setStock, reset } from '../features/servers/serverSlice';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerSmall from './SpinnerSmall';
import SpinnerFixed from './SpinnerFixed';

function ServerItem({ server }) {
  const [stockValue, setStockValue] = useState(+server.stock);
  const [Loading, setLoading] = useState(false);

  const { isLoading, stockIsLoading, stockIsSuccess } = useSelector(
    (state) => state.servers
  );
  const dispatch = useDispatch();

  const onHideServer = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${server.serverName}`
    );
    if (confirm) {
      dispatch(hideServer(server._id));
      toast.success(`${server.serverName} was removed`);
    }
  };
  useEffect(() => {
    if (Loading) {
      toast.success(`${server.serverName} stock ${stockValue}`);
      setLoading(false);
    }
    dispatch(reset);
  }, [Loading]);

  const onSubmit = (e) => {
    e.preventDefault();
    document.activeElement.blur();
  };

  const onSetStock = () => {
    if (+stockValue || +stockValue === 0) {
      if (server.stock !== +stockValue) {
        setLoading(true);
        dispatch(setStock({ id: server._id, stock: +stockValue }));
      }
    } else {
      //Not a number
      setStockValue(server.stock);
      toast.error('Stock has to be a number');
    }
  };

  const onFocus = (e) => {
    e.target.select();
  };
  return (
    <div className="row-3">
      <div className="icon-group-abs">
        <button className="details-btn" onClick={onHideServer}>
          <FaEyeSlash />
        </button>
      </div>
      <div>{server.gameName}</div>
      <div>{server.serverName}</div>
      <div>
        <form
          className="spinner-sm-container"
          onSubmit={onSubmit}
          onBlur={onSetStock}
        >
          <input
            type="text"
            onChange={(e) => setStockValue(e.target.value)}
            value={stockValue}
            onFocus={onFocus}
          />
          {Loading && <SpinnerSmall />}
        </form>
      </div>
    </div>
  );
}

export default ServerItem;
