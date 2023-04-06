const seedRoles = require('./roles');
const seedUsers = require('./users');

const seeder = async () => {
  await seedRoles();
  await seedUsers();
};

seeder();
console.log('Seed data checked');