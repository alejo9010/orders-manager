function ReportCard({ title = 'Title', profit, expenses, total }) {
  return (
    <div className="report-card month">
      <h1 className="report-card-title">
        {title}
        <hr />
      </h1>
      <div className="report-card-group">
        <h3>Profit</h3>
        <p>{profit}</p>
      </div>
      <div className="report-card-group">
        <h3>Expenses</h3>
        <p> {expenses}</p>
      </div>
      <div className="report-card-group">
        <h3>Total</h3>
        <p>{total}</p>
      </div>
    </div>
  );
}

export default ReportCard;
