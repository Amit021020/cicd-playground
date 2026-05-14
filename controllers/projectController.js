const projectModel = require("../models/project-model");
const deploymentModel = require("../models/deployment-model");

exports.getProjects = async (req, res) => {

    let projects = await projectModel.find({
        user: req.user._id
    });

    let projectIds = projects.map(p => p._id);

    let deployments = await deploymentModel.find({
        projectId: { $in: projectIds }
    });

    res.render("dashboard/project", {
        projects,
        deployments
    });
};