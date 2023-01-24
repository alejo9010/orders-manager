function ReportCard() {
  return (
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
        <p>{ReportMonth(orders, 'profit') - ReportMonth(expenses, 'amount')}</p>
      </div>
    </div>
  );
}

export default ReportCard;
