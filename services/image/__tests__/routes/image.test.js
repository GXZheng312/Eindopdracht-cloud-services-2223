const mockingoose = require('mockingoose');
const { createImage, getImageByUrl, updateImage, deleteImage } = require('../../repositories/image');
const Image = require('../../models/image');

describe('imageRepository', () => {
  beforeAll(() => {
    mockingoose(Image).toReturn([
      {
        url: 'https://example.com/image.png',
        uploadby: 'user'
      },
    ], 'find');
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  describe('createImage', () => {
    it('should create a new image', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      mockingoose(Image).toReturn({ _id: 1, url, uploadby }, 'save');

      // Create a new image and verify that its properties match the expected values
      const createdImage = await createImage(url, uploadby);

      expect(createdImage.url).toBe(url);
      expect(createdImage.uploadby).toBe(uploadby);

      // Mock the findById method to return the same object as the one returned by the save method
      mockingoose(Image).toReturn(createdImage, 'findOne');

      // Find the image by ID and verify that its properties match the expected values
      const foundImage = await getImageByUrl(createdImage.url);

      expect(foundImage.url).toBe(url);
      expect(foundImage.uploadby).toBe(uploadby);
    });
  });
  describe('getImageByUrl', () => {
    it('should return the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      const expectedImage = {
        url,
        uploadby,
      };
      mockingoose(Image).toReturn(expectedImage, 'findOne');

      const foundImage = await getImageByUrl(url);

      expect(foundImage.url).toBe(url);
      expect(foundImage.uploadby).toBe(uploadby);
    }); 

    it('should return null if the image with the given URL does not exist', async () => {
      mockingoose(Image).toReturn(null, 'findOne');

      const foundImage = await getImageByUrl('https://example.com/nonexistent.jpg');

      expect(foundImage).toBeNull();
    });
  });
  describe('updateImage', () => {
    it('should update the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';
      const newUploadBy = 'Jane Smith';

      const imageData = { url, uploadby: newUploadBy };
      const imageModel = new Image(imageData);
      const savedImage = await imageModel.save();

      mockingoose(Image).toReturn(savedImage, 'findOneAndUpdate');

      const updatedImage = await updateImage(url, { uploadby: newUploadBy });

      expect(updatedImage._id.toString()).toBe(savedImage._id.toString());
      expect(updatedImage.url).toBe(url);
      expect(updatedImage.uploadby).toBe(newUploadBy);
    });

    it('should return null if the image with the given URL does not exist', async () => {
      mockingoose(Image).toReturn(null, 'findOneAndUpdate');

      const updatedImage = await updateImage('https://example.com/nonexistent.jpg', { uploadby: 'Jane Smith' });

      expect(updatedImage).toBeNull();
    });
  });
  describe('deleteImage', () => {
    it('should delete the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      const imageData = { url, uploadby };
      const imageModel = new Image(imageData);
      const savedImage = await imageModel.save();

      mockingoose(Image).toReturn(savedImage, 'findOneAndDelete');

      const deletedImage = await deleteImage(url);

      expect(deletedImage._id.toString()).toBe(savedImage._id.toString());
      expect(deletedImage.url).toBe(url);
      expect(deletedImage.uploadby).toBe(uploadby);
    });

    it('should return null if the image with the given URL does not exist', async () => {
      mockingoose(Image).toReturn(null, 'findOneAndDelete');

      const deletedImage = await deleteImage('https://example.com/nonexistent.jpg');

      expect(deletedImage).toBeNull();
    });
  });
});