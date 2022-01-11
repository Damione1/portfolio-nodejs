const express = require('express')
const router = express.Router()
const Option = require('../models/option')

const { authenticateToken } = require('../middlewares/auth')
const { getOption, upload } = require('../middlewares/option')


router.get('/', authenticateToken, async(req, res) => {

    const fields = req.query.fields ? req.query.fields.split(',') : []

    findOptions = { user: req.user._id }

    if (fields.length > 0) {
        findOptions.key = { $in: fields }
    }

    try {
        const options = await Option.find()
        res.json(options)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getOption, (req, res) => {
    res.json(res.option)
})


router.post('/', authenticateToken, async(req, res) => {
    console.log(req);
    const newOption = await new Option({
        name: req.body.name,
        value: req.body.value,
        user: req.user,
    })
    try {
        await newOption.save()
        res.status(201).json(newOption)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:key', authenticateToken, getOption, async(req, res) => {

    if (req.body.key != null) {
        res.option.name = req.body.key
    }
    if (req.body.value != null) {
        res.option.value = req.body.value
    }

    try {
        const updatedOption = await res.option.save()
        res.json(updatedOption)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getOption, async(req, res) => {

    try {
        await res.option.remove()
        res.status(200).json({ message: 'Option deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router