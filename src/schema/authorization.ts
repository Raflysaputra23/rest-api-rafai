import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const DbName = 'authorization';

const AuthorizationSchema = new Schema({
    creator: {
        type: String,
        default: 'Rafly'
    },
    user: {
        type: String,
    },
    token: {
        type: String,
        default: uuidv4(),
    },
    limit: {
        type: Number,
        default: 500
    },
    unlimited: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

export { DbName, AuthorizationSchema };