const File = require('../models/file');
const multer = require('multer')

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

/* middleware to handle multer file upload */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = { getFile, upload }