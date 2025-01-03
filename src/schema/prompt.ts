import { Schema } from 'mongoose';

const DbName = 'prompt';

const PromptSchema = new Schema({
    prompt: {
        type: String
    },
    createAt: { 
        type: Date,
        default: Date.now() 
    }
});

export { DbName, PromptSchema };