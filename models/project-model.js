const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  projectname: String,
  repoUrl: String,
  branch: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }

})

module.exports = mongoose.model("project",projectSchema)