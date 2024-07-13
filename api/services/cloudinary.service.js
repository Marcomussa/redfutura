const cloudinary = require('cloudinary').v2;

class CloudinaryService {
  constructor() {
    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET
    } = process.env;
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
    });
  }

  async uploadImage(path, folder, name) {
    try {
      const options = {
        public_id: name,
        folder
      };
      const response = await cloudinary.uploader.upload(path, options);
      return response.url;

    } catch (error) {
      // TODO: Internal Server error
      console.log('ERROR:', error);
    }
  }

  async deleteImage() { }
}

module.exports = CloudinaryService;