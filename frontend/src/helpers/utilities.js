export const findServerById = (servers, id) => {
  const getServer = servers.filter((server) => server._id.toString() === id)[0];
  return getServer;
};
export const getDaysCountFromToday = (date) => {
  const today = new Date();

  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};
