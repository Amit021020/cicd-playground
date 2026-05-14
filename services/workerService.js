const deploymentModel = require("../models/deployment-model");
const dockerService = require("./dockerService");

// helper outside (IMPORTANT)
async function addLog(deployment, message) {
    deployment.logs.push({
        message,
        time: new Date()
    });
    await deployment.save();
}

async function startDeployment(deploymentId, repoUrl) {

    const deployment = await deploymentModel.findById(deploymentId);
    if (!deployment) return;

    try {

        // prevent rerun (safety check)
        if (deployment.status !== "queued") return;

        deployment.status = "building";
        await addLog(deployment, "Build started");

        const containerId = await dockerService.buildAndRun(
            deploymentId,
            repoUrl,
            async (msg) => {
                await addLog(deployment, msg);
            }
        );

        deployment.status = "success";
        deployment.containerId = containerId;
        deployment.deployedUrl = `http://localhost:3000`;
        let saveQueue = Promise.resolve();

        async function addLog(deployment, message) {
            saveQueue = saveQueue.then(async () => {
                deployment.logs.push({
                    message,
                    time: new Date()
                });

                await deployment.save();
            });

            return saveQueue;
        }


    } catch (err) {

        deployment.status = "failed";
        await addLog(deployment, "Deployment failed: " + err);

        await deployment.save();
    }
}

module.exports = { startDeployment };