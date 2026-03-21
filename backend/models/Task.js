const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  assignee: { type: String },
  deadline: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      if (ret.projectId) {
        ret.projectId = ret.projectId.toString();
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Task', TaskSchema);
