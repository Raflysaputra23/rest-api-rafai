import { Schema } from "mongoose";

const DbName = 'url';

const UrlSchema = new Schema({
    url: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

export { DbName, UrlSchema };