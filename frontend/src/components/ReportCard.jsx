function ReportCard({ title = 'Title', profit, expenses, total, gold }) {
  return (
    <div className='report-card month'>
      <h1 className='report-card-title'>
        {title}
        <hr />
      </h1>
      <div className='report-card-group'>
        <div className='report-field profit-color'>
          <h3>Profit</h3>
          <p className='report-value'>{profit}</p>
        </div>
      </div>
      <div className='report-card-group'>
        <div className='report-field gold-color'>
          <h3>Gold</h3>
          <p className='report-value'> {gold}</p>
        </div>
      </div>
      <div className='report-card-group'>
        <div className='report-field expenses-color'>
          <h3>Expenses</h3>
          <p className='report-value'> {expenses}</p>
        </div>
      </div>
      <div className='report-card-group'>
        <div className='report-field total-color'>
          <h3>Total</h3>
          <p className='report-value'>{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
