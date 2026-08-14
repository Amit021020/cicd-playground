const deploymentModel = require("../models/deployment-model");
const dockerService = require("./dockerService");

async function startDeployment(deploymentId, repoUrl, branch) {
    const deployment = await deploymentModel.findById(deploymentId);

    if (!deployment) {
        throw new Error("Deployment not found");
    }

    // Prevent the same deployment from running twice
    if (deployment.status !== "queued") {
        return;
    }

    // Queue database writes to prevent concurrent log saves
    let saveQueue = Promise.resolve();

    const addLog = (message) => {
        saveQueue = saveQueue.then(async () => {
            deployment.logs.push({
                message,
                time: new Date()
            });

            await deployment.save();
        });

        return saveQueue;
    };

    try {
        // Mark deployment as building
        deployment.status = "building";
        await deployment.save();

        await addLog("Deployment started");
        await addLog(`Repository: ${repoUrl}`);
        await addLog(`Branch: ${branch}`);

        // Build and start Docker container
        const result = await dockerService.buildAndRun(
            deploymentId,
            repoUrl,
            branch,
            addLog
        );

        // Deployment successful
        deployment.status = "success";
        deployment.containerId = result.containerId;
        deployment.deployedUrl = result.deployedUrl;

        await deployment.save();

        await addLog("Deployment completed successfully");

    } catch (error) {
        console.error("Deployment error:", error);

        deployment.status = "failed";
        await deployment.save();

        await addLog(`Deployment failed: ${error.message}`);
    }
}

module.exports = {
    startDeployment
};