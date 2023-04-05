const Role = require('../models/role');

async function getAllRoles() {
    const roles = await Role.find();
    return roles;
}

module.exports = {
    getAllRoles
  };