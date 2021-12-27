const Project = require('../models/project')

async function getProject(req, res, next) {
    let project
    try {
        project = await Project.findById(req.params.id)
        if (null === project) {
            return res.status(404).json({ message: 'Project not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.project = project
    next()

}

module.exports = { getProject }