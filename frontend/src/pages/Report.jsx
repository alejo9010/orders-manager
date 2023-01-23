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
  const [filteredCustomOrders, setFilteredCustomOrders] = useState(null);
  const [filteredCustomExpenses, setFilteredCustomExpenses] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(null);
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

  const filterByDate = (datas, date = new Date()) => {
    console.log('filterByDate Report.jsx');
    const datasMonth = datas.filter((data) => {
      const dataDate = new Date(data?.createdAt);
      if (
        dataDate.getMonth() === date.getMonth() &&
        dataDate.getFullYear() === date.getFullYear()
      )
        return data;
    });

    const datasToday = datasMonth.filter((data) => {
      const expenseDate = new Date(data?.createdAt);
      if (expenseDate.getDate() === date.getDate()) return data;
    });

    return { datasMonth, datasToday };
  };

  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getOrders());
  }, []);

  useEffect(() => {
    if (orderSuccess) {
      dispatch(OrderReset());
      setFilteredOrders(filterByDate(orders));
    }
    if (expensesSuccess) {
      dispatch(expenseReset());
      setFilteredExpenses(filterByDate(expenses));
    }
  }, [orderSuccess, expensesSuccess]);

  const onDateChange = (e) => {
    setFilteredCustomOrders(filterByDate(orders, e));
    setFilteredCustomExpenses(filterByDate(expenses, e));
  };
  if (orderLoading || expensesLoading || !filteredOrders) return <Spinner />;
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
            <p>
              {filteredOrders.datasToday.reduce(
                (acc, curr) => acc + curr.profit,
                0
              )}
            </p>
          </div>
          <div className="report-card-group">
            <h3>Expenses</h3>
            <p>
              {' '}
              {filteredExpenses.datasToday.reduce(
                (acc, curr) => acc + curr.amount,
                0
              )}
            </p>
          </div>
          <div className="report-card-group">
            <h3>Total</h3>
            <p>
              {' '}
              {filteredOrders.datasToday.reduce(
                (acc, curr) => acc + curr.profit,
                0
              ) -
                filteredExpenses.datasToday.reduce(
                  (acc, curr) => acc + curr.amount,
                  0
                )}
            </p>
          </div>
        </div>
        <div className="report-card month">
          <h1 className="report-card-title">
            Month
            <hr />
          </h1>
          <div className="report-card-group">
            <h3>Profit</h3>
            <p>
              {filteredOrders.datasMonth.reduce(
                (acc, curr) => acc + curr.profit,
                0
              )}
            </p>
          </div>
          <div className="report-card-group">
            <h3>Expenses</h3>
            <p>
              {' '}
              {filteredExpenses.datasMonth.reduce(
                (acc, curr) => acc + curr.amount,
                0
              )}
            </p>
          </div>
          <div className="report-card-group">
            <h3>Total</h3>
            <p>
              {' '}
              {filteredOrders.datasMonth.reduce(
                (acc, curr) => acc + curr.profit,
                0
              ) -
                filteredExpenses.datasMonth.reduce(
                  (acc, curr) => acc + curr.amount,
                  0
                )}
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
          {filteredCustomExpenses && filteredCustomOrders && (
            <>
              <h1 className="report-card-title">
                Custom
                <hr />
              </h1>
              <h2>Day</h2>
              <h4>
                Profit:{' '}
                {filteredCustomOrders?.datasToday.reduce(
                  (acc, curr) => acc + curr.profit,
                  0
                )}
              </h4>
              <h4>
                {' '}
                Expenses:{' '}
                {filteredCustomExpenses?.datasToday.reduce(
                  (acc, curr) => acc + curr.amount,
                  0
                )}
              </h4>
              <h4>
                Total:{' '}
                {filteredCustomOrders?.datasToday.reduce(
                  (acc, curr) => acc + curr.profit,
                  0
                ) -
                  filteredCustomExpenses?.datasToday.reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  ) || '0'}
              </h4>

              <h2>Month</h2>
              <h4>
                Profit:{' '}
                {filteredCustomOrders?.datasMonth.reduce(
                  (acc, curr) => acc + curr.profit,
                  0
                )}
              </h4>
              <h4>
                Expenses:{' '}
                {filteredCustomExpenses?.datasMonth.reduce(
                  (acc, curr) => acc + curr.amount,
                  0
                )}
              </h4>
              <h4>
                Total:{' '}
                {filteredCustomOrders?.datasMonth.reduce(
                  (acc, curr) => acc + curr.profit,
                  0
                ) -
                  filteredCustomExpenses?.datasMonth.reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  ) || '0'}
              </h4>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Report;
