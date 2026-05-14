const projectModel = require("../models/project-model");
const deploymentModel = require("../models/deployment-model");
const workerService = require("../services/workerService");

exports.deploy = async (req, res) => {

    const { projectname, repoUrl, branch } = req.body;

    const project = await projectModel.create({
        user: req.user._id,
        projectname,
        repoUrl,
        branch
    });

    const deployment = await deploymentModel.create({
        projectId: project._id,
        status: "queued",
        logs: [],
        containerId: null,
        deployedUrl: null
    });

    workerService.startDeployment(deployment._id,project.repoUrl);

    res.redirect("/deployments/logs/" + deployment._id);
};