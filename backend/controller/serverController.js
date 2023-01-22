const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Server = require('../models/serverModel');

// @desc    Get user servers
// @route   GET /api/servers
// @access  Private
const getServers = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const servers = await Server.find({ user: req.user.id });
  res.status(200).json(servers);
});

// @desc    Create new server
// @route   POST /api/servers
// @access  Private
const createServer = asyncHandler(async (req, res) => {
  const { gameName, serverName } = req.body;
  const serverExist = await Server.exists({
    serverName,
    gameName,
    isHidden: false,
  });
  if (!gameName || !serverName) {
    res.status(409);
    throw new Error('Please add game name / server name');
  }
  if (serverExist) {
    res.status(409);
    throw new Error('Server already exist');
  }
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  server = await Server.create({
    gameName,
    serverName,
    user: req.user.id,
  });

  res.status(201).json(server);
});

// @desc    Update server
// @route   PUT api/servers/:id
// @access  Private
const updateServer = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const server = await Server.findById(req.params.id);
  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }
  if (server.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json(updatedServer);
});

// @desc    Get user server
// @route   GET api/servers/:id
// @access  Private
const getServer = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const server = await Server.findById(req.params.id);
  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }
  if (server.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  res.status(200).json(server);
});

module.exports = {
  getServers,
  createServer,
  updateServer,
  getServer,
};
