const { exec } = require("child_process");
const config = require("../configs/config");
console.log("===== DOCKER DEBUG =====");
console.log("USER:", process.env.USER);
console.log("PATH:", process.env.PATH);
console.log("PWD:", process.cwd());
console.log("========================");
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {

            console.log("COMMAND:", command);
            console.log("ERROR:", error?.message);
            console.log("STDOUT:", stdout);
            console.log("STDERR:", stderr);

            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }

            resolve(stdout.trim());
        });
    });
}
async function buildAndRun(deploymentId, repoUrl, branch, logFn) {
    const workDir = `${config.docker.tempDir}/${deploymentId}`;
    const imageName = `deploy-${deploymentId}`;

    try {
        // Clone repository
        await logFn(`Cloning branch '${branch}'...`);

        await runCommand(
            `rm -rf "${workDir}" && git clone -b "${branch}" "${repoUrl}" "${workDir}"`
        );

        await logFn("Repository cloned successfully");

        // Build Docker image
        await logFn("Building Docker image...");

        await runCommand(
            `docker build -t "${imageName}" "${workDir}"`
        );

        await logFn("Docker image built successfully");

        // Start container
        await logFn("Starting Docker container...");

        const containerId = await runCommand(
            `docker run -d -p 0:3000 "${imageName}"`
        );

        await logFn(`Container started: ${containerId}`);

        // Get dynamically assigned port
        const port = await runCommand(
            `docker port "${containerId}" 3000`
        );

        /*
         * docker port normally returns something like:
         * 0.0.0.0:49152
         *
         * Convert it into a usable URL.
         */
        const hostPort = port.split(":").pop();

        const deployedUrl = `http://localhost:${hostPort}`;

        await logFn(`Application available at ${deployedUrl}`);

        return {
            containerId,
            deployedUrl
        };

    } catch (error) {
        await logFn(`Docker deployment failed: ${error.message}`);

        throw error;
    }
}

module.exports = {
    buildAndRun
};