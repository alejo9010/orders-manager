export const findServerById = (servers, id) => {
  const getServer = servers.filter((server) => server._id.toString() === id)[0];
  return getServer;
};
export const isCurrentDay = (date) => {
  const today = new Date();
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const isCurrentMonth = (date) => {
  const today = new Date();
  return (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
