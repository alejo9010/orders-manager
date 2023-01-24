import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/SpinnerFixed';
import Calendar, { MonthView } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  getExpenses,
  reset as expenseReset,
} from '../features/expenses/expenseSlice';
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

  useEffect(() => {
    if (orderSuccess) {
      dispatch(OrderReset());
    }
    if (expensesSuccess) {
      dispatch(expenseReset());
    }
  }, [orderSuccess, expensesSuccess]);

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
      .reduce((acc, curr) => acc + curr[propName], 0);
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
      .reduce((acc, curr) => acc + curr[propName], 0);
  };

  const onDateChange = (e) => {
    setDateValue(e);
  };
  if (orderLoading || expensesLoading) return <Spinner />;
  return (
    <main className="dashboard-main">
      <div className="report-layout">
        <div className="report-card month">
          <h1 className="report-card-title">
            Today
            <hr />
          </h1>
          <div className="report-card-group">
            <h3>Profit</h3>
            <p>{ReportDay(orders, 'profit')}</p>
          </div>
          <div className="report-card-group">
            <h3>Expenses</h3>
            <p> {ReportDay(expenses, 'amount')}</p>
          </div>
          <div className="report-card-group">
            <h3>Total</h3>
            <p>{ReportDay(orders, 'profit') - ReportDay(expenses, 'amount')}</p>
          </div>
        </div>
        <div className="report-card month">
          <h1 className="report-card-title">
            Month
            <hr />
          </h1>
          <div className="report-card-group">
            <h3>Profit</h3>
            <p>{ReportMonth(orders, 'profit')}</p>
          </div>
          <div className="report-card-group">
            <h3>Expenses</h3>
            <p>{ReportMonth(expenses, 'amount')}</p>
          </div>
          <div className="report-card-group">
            <h3>Total</h3>
            <p>
              {ReportMonth(orders, 'profit') - ReportMonth(expenses, 'amount')}
            </p>
          </div>
        </div>
        <div className="">
          <Calendar
            className="calendar-size"
            onChange={onDateChange}
            value={dateValue}
          />
        </div>
        <div className="report-card dateselected">
          <h1 className="report-card-title">
            Custom
            <hr />
          </h1>
          <h2>Day</h2>
          <h4>Profit: {ReportDay(orders, 'profit', dateValue)}</h4>
          <h4> Expenses: {ReportDay(expenses, 'amount', dateValue)}</h4>
          <h4>
            Total:
            {ReportDay(orders, 'profit', dateValue) -
              ReportDay(expenses, 'amount', dateValue)}
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
        </div>
      </div>
    </main>
  );
}

export default Report;
