import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: String,
    }, 
    { timestamps: true },
);

export default mongoose.model('Card', CardSchema);