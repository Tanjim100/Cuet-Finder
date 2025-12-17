const multer = require('multer');
const crypto = require('crypto')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads/')); // Ensure this path exists
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, (err, bytes) => {
        if (err) return cb(err);
        const fn = bytes.toString('hex') + path.extname(file.originalname);
        cb(null, fn);
      });
    }
  });
  
  const upload = multer({ storage: storage });
  
module.exports = upload