const mongoose = require('mongoose');

const TargetImage = mongoose.model('TargetImage');
const Image = mongoose.model('Image');

const targetImageSeeder = async () => {
    const image = await Image.findOne({ id: 1 });
    const newTargetImage = new TargetImage({
        id: 1,
        image: image,
        thumbsup: 0,
        placename: 'Den Bosch',
        radius: '200',
        description: 'Hoofdstad van Noord-Brabant'
    });
      await newTargetImage.save();
};

module.exports = async () => {
  await targetImageSeeder();
};
