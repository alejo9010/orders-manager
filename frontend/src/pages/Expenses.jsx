import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Pagination from '../components/Pagination';
import {
  getExpenses,
  reset,
  createExpense,
  deleteExpense,
} from '../features/expenses/expenseSlice';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/SpinnerInside';
import 'react-calendar/dist/Calendar.css';
import ExpenseItem from '../components/ExpenseItem';
import { toast } from 'react-toastify';
function Expenses() {
  const formInitialState = { amount: 0, note: '' };
  const [formData, setFormData] = useState(formInitialState);
  const { expenses, isLoading, isSuccess } = useSelector((state) => state.expenses);
  const dispatch = useDispatch();
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      dispatch(getExpenses());
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isNaN(formData.amount) && formData.amount !== '' && formData.note !== '') {
      setFormData(formInitialState);
      dispatch(createExpense(formData));
    } else {
      toast.error('Check data');
    }
  };
  const onDelete = (expenseId) => {
    const confirm = window.confirm('You really want to delete this expense?');
    if (confirm) {
      dispatch(deleteExpense(expenseId));
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <main className='dashboard-main'>
      <div className='expense-layout'>
        <div className='dashboard-table'>
          <div className='header-row-2'>
            <p>Amount</p>
            <p>Note</p>
          </div>
          {
            <Pagination>
              {expenses.map((expense) => {
                return <ExpenseItem onDelete={onDelete} expense={expense} key={expense._id} />;
              })}
            </Pagination>
          }
        </div>
        <div className='forsm'>
          <form action='' onSubmit={onSubmit} className='expenses-form'>
            <div className='expenses-form-group'>
              <h1>Add Expense</h1>
            </div>
            <div className='expenses-form-group'>
              <label htmlFor='amount'>Amount:</label>
              <input type='text' name='amount' placeholder='Amount' onChange={onChange} />
            </div>
            <div className='expenses-form-group'>
              <label htmlFor='note'>Note:</label>
              <textarea onChange={onChange} name='note' id='note' placeholder='Add note'></textarea>
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Expenses;
