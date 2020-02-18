module.exports = (e, res) => {
    let errors = {}
    Object.keys(e.errors).forEach(err => {
        errors[err] = e.errors[err].message
    })
    res.status(400).json(errors)
}
