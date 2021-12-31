require('dotenv').config();
const File = require('../models/file');
const Multer = require('multer')

async function getFile(req, res, next) {
    let file
    try {
        file = await File.findById(req.params.id)
        if (null === file) {
            return res.status(404).json({ message: 'File not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.file = file
    next()

}

/* write upload Multer middleware to hendle memoryStorage and add date in filename */
const upload = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }

});

module.exports = { getFile, upload }