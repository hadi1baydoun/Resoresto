import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  date: { type: Date, required: true },
  guests: { type: Number, required: true },
});

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

export default WaitingList;
