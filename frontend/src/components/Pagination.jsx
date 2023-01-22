import Pagi from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import usePagination from '../hooks/usePagination';
import { findServerById } from '../helpers/utilities';
import OrderItem from './OrderItem';
function Pagination({
  ordersData,
  serversData,
  onCloseOrder,
  onDeleteOrder,
  onOrderDetails,
}) {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const count = Math.ceil(ordersData.length / PER_PAGE);
  const _DATA = usePagination(ordersData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  return (
    <>
      {_DATA.currentData().map((order) => {
        const serverOfOrder = findServerById(serversData, order.server);
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
      <Pagi
        count={count}
        className="pagination-btns"
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </>
  );
}

export default Pagination;
