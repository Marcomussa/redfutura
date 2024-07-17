const fs = require('fs');
const multer = require('multer');

const BYTES_IN_MEGABYTE = 1024 * 1024;
const FILE_MB_LIMIT = 5;
const FILE_SIZE_LIMIT = FILE_MB_LIMIT * BYTES_IN_MEGABYTE;

const VALID_MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationDirectory = `${__dirname}/../../uploads`;
    const existsDirectory = fs.existsSync(destinationDirectory);

    if (!existsDirectory) {
      fs.mkdirSync(destinationDirectory);
    }

    cb(null, destinationDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const validateMimetype = (file) => {
  const { mimetype } = file;

  if (!VALID_MIMETYPES.includes(mimetype)) {
    throw new Error(`Image must be one of the following: ${[...VALID_MIMETYPES]}`);
  }
};

const validateSize = (file) => {
  const { size } = file;
  if (size > FILE_SIZE_LIMIT) {
    throw new Error(`File cannot exceed ${FILE_MB_LIMIT}MB`)
  }
};

const validateFile = (file) => {
  if (!file) {
    throw new Error('File is required')
  }
  validateSize(file);
  validateMimetype(file);
};

const upload = multer({ storage })

module.exports = { upload, validateFile };