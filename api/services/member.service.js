const MemberRepository = require('../db/repositories/member.repository');
const CloudinaryService = require('./cloudinary.service');

const { validateFile } = require('../utils/multer');
const emptyUploadsDirectory = require('../utils/emptyUploadsDirectory');

const TEST_DEFAULT_IMAGE = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';
const CLOUDINARY_MEMBERS_FOLDER = 'members';

class MemberService {
  constructor() {
    this._repository = new MemberRepository()
    this._cloudinaryService = new CloudinaryService()
  }

  async getMembers() {
    return this._repository.findMany({});
  }

  validateMember(member) {
    const {
      name,
      businessName,
      fantasyName,
      address,
      city,
      province,
      postalCode,
      section
    } = member;

    if (
      !name ||
      !businessName ||
      !fantasyName ||
      !address ||
      !city ||
      !province ||
      !postalCode ||
      !section
    ) {
      throw new Error('Please complete all fields')
    }
  }

  async createMember(member) {
    const { file } = member;

    try {
      this.validateMember(member);
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_MEMBERS_FOLDER, member.name);
      member.image = url;
      member.imageId = publicId

      const response = await this._repository.create(member)
      emptyUploadsDirectory();
      return response;
    } catch (error) {
      if (member.imageId) {
        await this._cloudinaryService.deleteImage(member.imageId);
      }

      emptyUploadsDirectory();
      throw error;
    }
  }

  async updateMember(memberId, member) {
    try {
      this.validateMember(member);

      const updatedMember = await this._repository.updateById(memberId, member, true);
      return updatedMember;
    } catch (error) {
      throw error;
    }
  }

  async updateMemberImage(memberId, file) {
    try {
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_MEMBERS_FOLDER, memberId);

      const updateData = { imageId: publicId, image: url };
      const oldMember = await this._repository.updateById(memberId, updateData);

      const { imageId } = oldMember;
      await this._cloudinaryService.deleteImage(imageId);

      emptyUploadsDirectory();
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }
  }

  async deleteMember(memberId) {
    if (!memberId) {
      throw new Error('Member id must be provided');
    }

    try {
      const deletedMember = await this._repository.deleteById(memberId);

      if (!deletedMember) {
        throw new Error(`Member with id ${memberId} does not exist`);
      }

      await this._cloudinaryService.deleteImage(deletedMember.imageId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MemberService;
