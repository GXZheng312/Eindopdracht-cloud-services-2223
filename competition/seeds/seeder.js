const seedImages = require('./imageSeeder');
const seedTargetImages = require('./targetImageSeeder');

const seeder = async () => {
  await seedImages();
  await seedTargetImages();
};

seeder();
console.log('Seed data checked competition');
