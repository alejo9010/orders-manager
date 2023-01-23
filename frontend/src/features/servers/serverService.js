import axios from 'axios';

const API_URL = '/api/servers/';
//Get all servers
const getServers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data
    .sort((a, b) => a.serverName.localeCompare(b.serverName))
    .sort((a, b) => a.gameName.localeCompare(b.gameName));
};

//get server
const getServer = async (serverId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + serverId, config);
  return response.data;
};

//Create new server
const createServer = async (serverData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, serverData, config);
  return response.data;
};

//Hide server
const hideServer = async (serverId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + serverId,
    { isHidden: true },
    config
  );
  return response.data;
};

//Set server stock
const setStock = async (serverId, serverStock, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + serverId,
    { stock: +serverStock },
    config
  );
  return { ...response.data, stock: +serverStock };
};

const serverService = {
  createServer,
  getServers,
  hideServer,
  setStock,
  getServer,
};

export default serverService;
