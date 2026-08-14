const deploymentModel = require("../models/deployment-model");
const dockerService = require("./dockerService");

async function startDeployment(deploymentId, repoUrl) {

    const deployment = await deploymentModel.findById(deploymentId);
    if (!deployment) return;

    // Queue database writes so multiple log messages don't overwrite each other
    let saveQueue = Promise.resolve();

    function addLog(message) {
        saveQueue = saveQueue.then(async () => {
            deployment.logs.push({
                message,
                time: new Date()
            });

            await deployment.save();
        });

        return saveQueue;
    }

    try {

        // Prevent rerun
        if (deployment.status !== "queued") return;

        deployment.status = "building";
        await deployment.save();

        await addLog("Build started");

        const containerId = await dockerService.buildAndRun(
            deploymentId,
            repoUrl,
            async (msg) => {
                await addLog(msg);
            }
        );

        deployment.status = "success";
        deployment.containerId = containerId;
        deployment.deployedUrl = "http://localhost:3000";

        await deployment.save();

        await addLog("Deployment successful");

    } catch (err) {

        deployment.status = "failed";

        await addLog(
            "Deployment failed: " + err.message
        );

        await deployment.save();
    }
}

module.exports = { startDeployment };