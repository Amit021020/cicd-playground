const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema(
{
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    status: {
        type: String,
        enum: ["queued", "building", "success", "failed"],
        default: "queued"
    },

    logs: [
        {
            message: String,
            time: {
                type: Date,
                default: Date.now
            }
        }
    ],

    containerId: String,
    deployedUrl: String
},
{
    timestamps: true
});

module.exports = mongoose.model("Deployment", deploymentSchema);