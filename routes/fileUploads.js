require('dotenv').config();
const express = require('express');
const router = express.Router();
const File = require('../models/file');
const { authenticateToken } = require('../middlewares/auth');
const { getFile, upload } = require('../middlewares/fileUpload');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const uuid = require('uuid');

let storage;
if (process.env.NODE_ENV === 'production') {
    storage = new Storage();
} else {
    storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        keyFilename: './gcs_key.json'
    });
}

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);

const uploadMiddleware = multer({
    limits: {
        fileSize: 1024 * 1024 * 10 // limit file size to 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const files = await File.find({ user: req.user._id });
        res.json(files);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', authenticateToken, getFile, (req, res) => {
    res.json(res.file);
});

router.post('/', authenticateToken, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const fileName = `${uuid.v4()}-${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(`uploads/${fileName}`);
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            },
            public: true,
            resumable: false
        });

        stream.on('error', (err) => {
            next(err);
        });

        stream.on('finish', async () => {
            try {
                const file = await File.create({
                    user: req.user._id,
                    fileName,
                    size: req.file.size,
                    type: req.file.mimetype,
                    url: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/uploads/${fileName}`
                });
                res.json(file);
            } catch (err) {
                next(err);
            }
        });

        stream.end(req.file.buffer);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', authenticateToken, getFile, async (req, res, next) => {
    try {
        if (req.body.name != null) {
            res.file.name = req.body.name;
        }
        if (req.body.description != null) {
            res.file.description = req.body.description;
        }
        const updatedFile = await res.file.save();
        res.json(updatedFile);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticateToken, getFile, async (req, res, next) => {
    try {
        const oldFile = bucket.file(`uploads/${res.file.fileName}`);
        await oldFile.delete();
        await res.file.remove();
        res.json({ message: 'File deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
