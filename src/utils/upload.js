/**
 * Upload helper: Multer config + Sharp resize for avatars.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.AVATAR_MAX_SIZE || '2000000') }, // 2MB default
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Formato de imagem não suportado'), false);
    cb(null, true);
  }
});

async function processAvatar(buffer, filenamePrefix = 'avatar', size = 256) {
  const id = uuidv4();
  const filename = `${filenamePrefix}-${id}.webp`;
  const outPath = path.join(process.env.UPLOAD_DIR || './uploads', filename);
  await sharp(buffer)
    .resize(size, size, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(outPath);
  return outPath;
}

module.exports = { upload, processAvatar };
