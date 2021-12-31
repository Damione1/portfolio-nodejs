require('dotenv').config();
const express = require('express')
const router = express.Router()
const File = require('../models/file')

const { authenticateToken } = require('../middlewares/auth')
const { getFile, upload } = require('../middlewares/fileUpload')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: './portfolio-336617-d9147483d2a8.json'
})
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET)

// @route   GET api/files
// @desc    Get all files
// @access  Public
router.get('/', authenticateToken, async(req, res) => {
    try {
        const files = await File.find({ user: req.user._id })
        res.json(files)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getFile, (req, res) => {
    res.json(res.file)
})


router.post('/', authenticateToken, upload.single('file'), async(req, res) => {

    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}-${req.file.originalname}`
            /* save the file inside a '/uploads' folder on the google cloud bucket */
        const file = bucket.file(`uploads/${fileName}`)
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            },
            public: true,
            resumable: false

        })

        stream.on('error', (err) => {
            console.log(err)
            return res.status(500).send({ message: err.message })
        })
        stream.on('finish', async() => {
            try {
                const file = await File.create({
                    user: req.user._id,
                    fileName,
                    size: req.file.size,
                    type: req.file.mimetype,
                    url: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/uploads/${fileName}`
                })
                res.json(file)
            } catch (err) {
                console.log(err)
                return res.status(500).send({ message: err.message })
            }
        })
        stream.end(req.file.buffer)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getFile, async(req, res) => {

    if (req.body.name != null) {
        res.file.name = req.body.name
    }
    if (req.body.description != null) {
        res.file.description = req.body.description
    }

})

router.delete('/:id', authenticateToken, getFile, async(req, res) => {

    try {
        const oldFile = bucket.file(`uploads/${res.file.fileName}`)
        await oldFile.delete()
        const file = await res.file.remove()
        res.json('File deleted')
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }

})

module.exports = router