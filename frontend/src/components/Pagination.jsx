import Pagi from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import usePagination from '../hooks/usePagination';
import { findServerById } from '../helpers/utilities';
import OrderItem from './OrderItem';
function Pagination({ children }) {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const count = Math.ceil(children.length / PER_PAGE);
  const _DATA = usePagination(children, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  return (
    <>
      {_DATA.currentData().map((data) => {
        return data;
      })}
      <Pagi
        count={count}
        className="pagination-btns"
        size="small"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </>
  );
}

export default Pagination;
