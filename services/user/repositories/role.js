const Role = require('../models/role');

async function getAllRoles() {
    const roles = await Role.find();
    return roles;
}
const createRole = async (rolename) => {
    const role = new Role({
      rolename
    });
    await role.save();
    return role;
  };
module.exports = {
    getAllRoles,
    createRole
  };