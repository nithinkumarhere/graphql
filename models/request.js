import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    kycId: {
        type: String,
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    requestedOn: {
        type: String,
        required: true
    },
    respondedOn: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    },
    passport: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    kycStatus: {
        type: String,
        required: true
    }
});

export default mongoose.model('Request', RequestSchema);