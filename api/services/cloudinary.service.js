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
    const publicId = `${Date.now()}_${name}`;

    try {
      const options = {
        public_id: publicId,
        folder
      };
      const response = await cloudinary.uploader.upload(path, options);

      return { publicId: response.public_id, url: response.url };

    } catch (error) {
      throw error;
    }
  }

  async deleteImage(publicId) {
    if (!publicId) {
      console.log('WARNING: No publicId provided to delete image from Cloudinary')
      return;
    }
    await cloudinary.uploader.destroy(publicId)
  }
}

module.exports = CloudinaryService;