const { exec } = require("child_process");
const config = require("../configs/config");

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr?.trim() || error.message));
                return;
            }

            resolve(stdout.trim());
        });
    });
}

async function getExposedPort(imageName) {
    const output = await runCommand(
        `docker image inspect "${imageName}" --format '{{json .Config.ExposedPorts}}'`
    );

    if (!output || output === "null" || output === "{}") {
        throw new Error(
            "No exposed port found in Docker image. Add EXPOSE <port> to the Dockerfile."
        );
    }

    const exposedPorts = Object.keys(JSON.parse(output));

    if (exposedPorts.length === 0) {
        throw new Error("Docker image does not expose any port.");
    }

    // Example: ["5000/tcp"]
    // Take the first exposed TCP port.
    const tcpPort = exposedPorts.find(port => port.endsWith("/tcp"));

    if (!tcpPort) {
        throw new Error("No TCP exposed port found in Docker image.");
    }

    return tcpPort.split("/")[0];
}

async function buildAndRun(deploymentId, repoUrl, branch, logFn) {
    const workDir = `${config.docker.tempDir}/${deploymentId}`;
    const imageName = `deploy-${deploymentId}`;

    try {
        // --------------------------------
        // Clone repository
        // --------------------------------

        await logFn(`Cloning branch '${branch}'...`);

        await runCommand(
            `rm -rf "${workDir}" && git clone -b "${branch}" "${repoUrl}" "${workDir}"`
        );

        await logFn("Repository cloned successfully");


        // --------------------------------
        // Build Docker image
        // --------------------------------

        await logFn("Building Docker image...");

        await runCommand(
            `docker build -t "${imageName}" "${workDir}"`
        );

        await logFn("Docker image built successfully");


        // --------------------------------
        // Detect exposed port
        // --------------------------------

        await logFn("Detecting exposed port...");

        const containerPort = await getExposedPort(imageName);

        await logFn(
            `Detected container port: ${containerPort}`
        );


        // --------------------------------
        // Start container
        // --------------------------------

        await logFn("Starting Docker container...");

        const containerId = await runCommand(
            `docker run -d -p 0:${containerPort} "${imageName}"`
        );

        await logFn(`Container started: ${containerId}`);


        // --------------------------------
        // Get assigned host port
        // --------------------------------

        const portMapping = await runCommand(
            `docker port "${containerId}" ${containerPort}`
        );

        /*
         * Example:
         *
         * 0.0.0.0:32769
         * [::]:32769
         */

        const hostPort = portMapping
            .split("\n")[0]
            .split(":")
            .pop()
            .trim();

        if (!hostPort) {
            throw new Error("Unable to determine assigned host port.");
        }


        // --------------------------------
        // Application URL
        // --------------------------------

        const deployedUrl = `http://localhost:${hostPort}`;

        await logFn(
            `Application available at ${deployedUrl}`
        );

        await logFn("Deployment completed successfully");


        return {
            containerId,
            containerPort,
            hostPort,
            deployedUrl
        };

    } catch (error) {

        await logFn(
            `Docker deployment failed: ${error.message}`
        );

        throw error;
    }
}

module.exports = {
    buildAndRun
};