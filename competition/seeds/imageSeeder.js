const mongoose = require('mongoose');

const Image = mongoose.model('Image');

const imageSeeder = async () => {
    const newImage = new Image({
        id: 1,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1575936123452-b67c3203c357%3Fixlib%3Drb-4.0.3%26ixid%3DMnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8%26w%3D1000%26q%3D80&tbnid=YmDohMp4T5AODM&vet=12ahUKEwjs25qdpo7-AhUQgP0HHVYKBkgQMygCegUIARC8AQ..i&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&docid=ExDvm63D_wCvSM&w=1000&h=667&itg=1&q=image&ved=2ahUKEwjs25qdpo7-AhUQgP0HHVYKBkgQMygCegUIARC8AQ',
        uploadby: 'Gebruiker',
    });
      await newImage.save();
};

module.exports = async () => {
  await imageSeeder();
};
