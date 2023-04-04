const mongoose = require('mongoose');

const Role = mongoose.model('Role');
const User = mongoose.model('User');

const userSeed = async () => {
  const userPassword = 'gebruiker123';

  try {
    const userRole = await Role.findOne({ rolename: 'Gebruiker' });
    if (!await User.findOne({ username: 'Gebruiker' })) {
      const newUser = new User({
        username: 'Gebruiker',
        password: userPassword,
        roleId: userRole._id,
      });
      await newUser.save();
    }
  } catch (err) {
    console.error(err);
  }
};

const adminSeed = async () => {
    const adminPassword = 'beheerder123';
  
    try {
      const adminRole = await Role.findOne({ rolename: 'Beheerder' });
      if (!await User.findOne({ username: 'Beheerder' })) {
        const newAdminUser = new User({
          username: 'Beheerder',
          password: adminPassword,
          roleId: adminRole._id,
        });
        await newAdminUser.save();
      }
    } catch (err) {
      console.error(err);
    }
  };
  

module.exports = async () => {
  await userSeed();
  await adminSeed();
};
