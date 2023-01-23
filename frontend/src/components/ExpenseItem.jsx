import { FaTrash } from 'react-icons/fa';
function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="row-2">
      {onDelete && (
        <div className="icon-group-abs">
          <button onClick={() => onDelete(expense._id)} className="delete-btn">
            <FaTrash />
          </button>
        </div>
      )}
      <p>{expense.amount}</p>
      <p>{expense.note}</p>
    </div>
  );
}

export default ExpenseItem;
