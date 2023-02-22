import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SpinnerInside from '../components/SpinnerInside';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReportCard from '../components/ReportCard';
import { getExpenses, reset as expenseReset } from '../features/expenses/expenseSlice';
import { getOrders, OrderReset } from '../features/orders/orderSlice';

function Report() {
  const dispatch = useDispatch();
  const [dateValue, setDateValue] = useState(new Date());
  const {
    expenses,
    isSuccess: expensesSuccess,
    isLoading: expensesLoading,
  } = useSelector((state) => state.expenses);
  const {
    orders,
    isSuccess: orderSuccess,
    isLoading: orderLoading,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getOrders());
  }, []);
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [expenesesLoaded, setexpenesesLoaded] = useState(false);
  const [orderResume, setOrderResume] = useState({
    dayProfit: 0,
    monthProfit: 0,
    dayExpenses: 0,
    monthExpenses: 0,
    dayGold: 0,
    monthGold: 0,
  });
  useEffect(() => {
    if (orderSuccess) {
      setOrderLoaded(true);
      dispatch(OrderReset());
    }
    if (expensesSuccess) {
      setexpenesesLoaded(true);
      dispatch(expenseReset());
    }
  }, [orderSuccess, expensesSuccess]);

  useEffect(() => {
    if ((orderLoaded, expenesesLoaded)) {
      setOrderResume((state) => ({
        ...state,
        dayProfit: ReportDay(orders, 'profit'),
      }));
      console.log(orders);
    } else {
      console.log('Not loaded');
    }
  }, [orderLoaded, expenesesLoaded]);

  const ReportDay = (data, propName, date = new Date()) => {
    return data
      .filter((item) => {
        const itemDate = new Date(item?.createdAt);
        if (
          itemDate.getDate() === date.getDate() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getFullYear() === date.getFullYear()
        )
          return data;
      })
      .reduce((acc, curr) => acc + curr[propName], 0)
      .toFixed(2);
  };
  const ReportMonth = (data, propName, date = new Date()) => {
    return data
      .filter((item) => {
        const itemDate = new Date(item?.createdAt);
        if (
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getFullYear() === date.getFullYear()
        )
          return data;
      })
      .reduce((acc, curr) => acc + curr[propName], 0)
      .toFixed(2);
  };
  const ReportDayMemo = useMemo((data, propName, date = new Date()) => ReportDay, [dateValue]);
  const onDateChange = (e) => {
    setDateValue(e);
  };

  const UseSpinner = orderLoading || expensesLoading;

  if (UseSpinner) return <SpinnerInside />;
  return (
    <main className='dashboard-main'>
      <div className='report-layout'>
        <div className='d-flex'>
          {(UseSpinner && <SpinnerInside />) || (
            <ReportCard
              profit={ReportDay(orders, 'profit', dateValue)}
              gold={ReportDay(orders, 'gold', dateValue)}
              expenses={ReportDay(expenses, 'amount', dateValue)}
              total={
                ReportDay(orders, 'profit', dateValue) - ReportDay(expenses, 'amount', dateValue)
              }
              title={`${dateValue.toLocaleDateString('en-US', { weekday: 'long' })}`}
            />
          )}
          {
            <ReportCard
              profit={ReportMonth(orders, 'profit', dateValue)}
              expenses={ReportMonth(expenses, 'amount', dateValue)}
              gold={ReportMonth(orders, 'gold', dateValue)}
              total={
                ReportMonth(orders, 'profit', dateValue) -
                ReportMonth(expenses, 'amount', dateValue)
              }
              title={dateValue.toLocaleDateString('en-US', { month: 'long' })}
            />
          }
        </div>
        <div className=''>
          <Calendar className='calendar-size' onChange={onDateChange} value={dateValue} />
        </div>
        {/* <div className="report-card dateselected">
          <h1 className="report-card-title">
            Custom
            <hr />
          </h1>
          {(UseSpinner && <SpinnerInside />) || (
            <>
              <h2>Day</h2>
              <h4>Profit: {ReportDayMemo(orders, 'profit', dateValue)}</h4>
              <h4> Expenses: {ReportDayMemo(expenses, 'amount', dateValue)}</h4>
              <h4>
                Total:
                {ReportDayMemo(orders, 'profit', dateValue) -
                  ReportDayMemo(expenses, 'amount', dateValue)}
              </h4>
              <hr />
              <h2>Month</h2>
              <h4>Profit: {ReportMonth(orders, 'profit', dateValue)}</h4>
              <h4>Expenses: {ReportMonth(expenses, 'amount', dateValue)}</h4>
              <h4>
                Total:
                {ReportMonth(orders, 'profit', dateValue) -
                  ReportMonth(expenses, 'amount', dateValue)}
              </h4>
            </>
          )}
        </div> */}
      </div>
    </main>
  );
}

export default Report;
