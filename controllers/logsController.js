const deploymentModel = require('../models/deployment-model')
exports.getLogs = async (req, res) => {

    const deployment = await deploymentModel.findById(req.params.id);

    if (!deployment) {
        return res.status(404).send("Deployment not found");
    }

    res.render("dashboard/logs", {
        deployment
    });
}