import mongoose from 'mongoose';

const dbConnect = async () => {
    console.log(process.env.MONGODB_URI);
    if (mongoose.connection.readyState >= 1) return;

    return await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default dbConnect;
