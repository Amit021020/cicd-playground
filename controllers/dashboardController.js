const userModel =require('../models/user-model')
const projectModel =require('../models/project-model')
const deploymentModel =require('../models/deployment-model')


exports.getDashboard = async (req, res) => {

    const userId = req.user._id;

    const projectsCount = await projectModel.countDocuments({ user: userId });

    const deploymentsCount = await deploymentModel.countDocuments({ user: userId });

    const activeDeployments = await deploymentModel.countDocuments({
        user: userId,
        status: "building"
    });

    const deployments = await deploymentModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10);
    res.render("dashboard/index", {
        user: req.user,
        stats: {
            projects: projectsCount,
            deployments: deploymentsCount,
            active: activeDeployments
        },
        deployments
    });
}