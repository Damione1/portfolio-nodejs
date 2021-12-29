require('dotenv').config();
const express = require('express')
const router = express.Router()
const File = require('../models/file')

const { authenticateToken } = require('../middlewares/auth')
const { getFile, upload } = require('../middlewares/fileUpload')


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

    const newFile = await new File({
        name: req.body.name,
        description: req.body.description,
        fileName: req.file.filename,
        user: req.user,
    })
    try {
        await newFile.save()
        res.status(201).json(newFile)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getFile, async(req, res) => {

    if (req.body.name != null) {
        res.file.name = req.body.name
    }
    if (req.body.description != null) {
        res.file.description = req.body.description
    }

    try {
        const updatedFile = await res.file.save()
        res.json(updatedFile)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getFile, async(req, res) => {

    try {
        await res.file.remove()
        res.status(200).json({ message: 'File deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router