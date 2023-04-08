const mongoose = require('mongoose');

const Role = mongoose.model('Roles');
const User = mongoose.model('Users');

const userSeed = async () => {
    const username = "user"
    const password = "root123";

  try {
    const role = await Role.findOne({ rolename: "user" });
    if (!await User.findOne({ username: username })) {
      console.log('\tNo default user found, filling seed data');
      const newSuperAdminUser = new User({
        username: username,
        password: password,
        address: {
          street: "Tjalk 157",
          city: "Lelystad",
          zip: "8232NB",
        },
        role: role._id,
      });
      await newSuperAdminUser.save()
        .then(() => console.log('\tFilling roles seed data succesfull'))
        .catch((err) => console.log('\tFilling roles seed data failed', err));
    }
  } catch (err) {
    console.error(err);
  }
};

const adminSeed = async () => {
    const username = "admin";
    const password = "root123";

  try {
    const role = await Role.findOne({ rolename: "admin" });
    if (!await User.findOne({ username: username })) {
      console.log('\tNo default admin found, filling seed data');
      const newAdminUser = new User({
        username: username,
        password: password,
        address: {
          street: "Eykmanstraat 141",
          city: "Wageningen",
          zip: "6706JX",
        },
        role: role._id,
      });
      await newAdminUser.save()
        .then(() => console.log('\tFilling roles seed data succesfull'))
        .catch((err) => console.log('\tFilling roles seed data failed', err));
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = async () => {
  await userSeed();
  await adminSeed();
};