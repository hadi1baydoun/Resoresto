import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  restaurantChain: { type: String, required: true },
  numberOfTables: { type: Number, required: true },
  details: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Package', packageSchema);
