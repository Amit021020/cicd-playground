const { exec } = require("child_process");
const path = require("path");
    const config = require("../configs/config");


async function buildAndRun(deploymentId, repoUrl, logFn) {


    const workDir = `${config.docker.tempDir}/${deploymentId}`; 

    return new Promise((resolve, reject) => {

        logFn("Cloning repository...");

        exec(`rm -rf ${workDir} && git clone ${repoUrl} ${workDir}`, (err) => {
            if (err) return reject("Git clone failed");

            logFn("Repository cloned");

            logFn("Building Docker image...");

            exec(`docker build -t deploy-${deploymentId} ${workDir}`, (err) => {
                if (err) return reject("Docker build failed");

                logFn("Docker image built");

                logFn("Running container...");

                exec(
                    `docker run -d -p 0:3000 deploy-${deploymentId}`,
                    (err, stdout) => {

                        if (err) return reject("Docker run failed");

                        const containerId = stdout.trim();

                        logFn("Container started: " + containerId);

                        resolve(containerId);
                    }
                );
            });
        });
    });
}

module.exports = { buildAndRun };