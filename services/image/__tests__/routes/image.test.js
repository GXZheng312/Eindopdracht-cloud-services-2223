const mongoose = require('mongoose');
const { createImage, getImageByUrl, updateImage, deleteImage } = require('../../repositories/image');
const Image = require('../../models/image');

describe('imageRepository', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Image.deleteMany({});
  });

  describe('createImage', () => {
    it('should create a new image', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      const createdImage = await createImage(url, uploadby);

      expect(createdImage.url).toBe(url);
      expect(createdImage.uploadby).toBe(uploadby);

      const foundImage = await Image.findById(createdImage._id);

      expect(foundImage.url).toBe(url);
      expect(foundImage.uploadby).toBe(uploadby);
    });

    it('should throw an error if url is missing', async () => {
      const uploadby = 'John Doe';

      await expect(createImage(undefined, uploadby)).rejects.toThrow();
    });

    it('should throw an error if uploadby is missing', async () => {
      const url = 'https://example.com/image.jpg';

      await expect(createImage(url, undefined)).rejects.toThrow();
    });
  });
  describe('getImageByUrl', () => {
    it('should return the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      const createdImage = await createImage(url, uploadby);

      const foundImage = await getImageByUrl(url);

      expect(foundImage._id.toString()).toBe(createdImage._id.toString());
      expect(foundImage.url).toBe(url);
      expect(foundImage.uploadby).toBe(uploadby);
    });

    it('should return null if the image with the given URL does not exist', async () => {
      const foundImage = await getImageByUrl('https://example.com/nonexistent.jpg');

      expect(foundImage).toBeNull();
    });
  });
   describe('updateImage', () => {
    it('should update the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';
      const newUploadBy = 'Jane Smith';

      const createdImage = await createImage(url, uploadby);

      const updatedImage = await updateImage(url, { uploadby: newUploadBy });

      expect(updatedImage._id.toString()).toBe(createdImage._id.toString());
      expect(updatedImage.url).toBe(url);
      expect(updatedImage.uploadby).toBe(newUploadBy);

      const foundImage = await Image.findById(createdImage._id);

      expect(foundImage._id.toString()).toBe(createdImage._id.toString());
      expect(foundImage.url).toBe(url);
      expect(foundImage.uploadby).toBe(newUploadBy);
    });

    it('should return null if the image with the given URL does not exist', async () => {
      const updatedImage = await updateImage('https://example.com/nonexistent.jpg', { uploadby: 'Jane Smith' });

      expect(updatedImage).toBeNull();
    });
  });
  describe('deleteImage', () => {
    it('should delete the image with the given URL', async () => {
      const url = 'https://example.com/image.jpg';
      const uploadby = 'John Doe';

      const createdImage = await createImage(url, uploadby);

      const deletedImage = await deleteImage(url);

      expect(deletedImage._id.toString()).toBe(createdImage._id.toString());
      expect(deletedImage.url).toBe(url);
      expect(deletedImage.uploadby).toBe(uploadby);

      const foundImage = await Image.findById(createdImage._id);

      expect(foundImage).toBeNull();
    });

    it('should return null if the image with the given URL does not exist', async () => {
      const deletedImage = await deleteImage('https://example.com/nonexistent.jpg');

      expect(deletedImage).toBeNull();
    });
  });
});
