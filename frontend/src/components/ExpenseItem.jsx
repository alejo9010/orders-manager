import { FaTrash } from 'react-icons/fa';
function ExpenseItem({ expense, onDelete }) {
  return (
    <div className='row-3'>
      {onDelete && (
        <div className='icon-group-abs'>
          <button onClick={() => onDelete(expense._id)} className='delete-btn'>
            <FaTrash />
          </button>
        </div>
      )}
      <p>
        {new Date(expense.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p>{expense.amount}</p>
      <p>{expense.note}</p>
    </div>
  );
}

export default ExpenseItem;
