import mongoose from 'mongoose';

class db {
    schema: any;
    collection: string;

    constructor(collection: string, schema: any) {
        this.schema = schema;
        this.collection = collection;
    }    

    static async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rafai");
            console.log('Database connected');
        } catch (error) {
            console.log('Database connection error:', error);
        }
    }

    model = () => {
        return mongoose.model(this.collection, this.schema);
    }

    createOne = async (data: any) => {
        return await this.model().create(data);
    }

    createMany = async (data: any) => {
        return await this.model().insertMany(data);
    }

    selectOne = async (id: any) => {
        return await this.model().findOne(id);
    }

    selectMany = async () => {
        return await this.model().find();
    }

    updateOne = async (id: any, data: any) => {
        return await this.model().updateOne(id, data);
    }

    updateMany = async (data: any) => {
        return await this.model().updateMany(data);
    }

    deleteOne = async (id: any, data: any) => {
        return await this.model().deleteOne(id, data);
    }

    deleteMany = async (data: any) => {
        return await this.model().deleteMany(data);
    }

}

export default db;