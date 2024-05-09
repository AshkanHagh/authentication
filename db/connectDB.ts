import mongoose from 'mongoose';

const dbUrl : string = process.env.DATABASE_URL || ''

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(dbUrl);
        console.log(`Database connected to ${conn.connection.host}`);
        
    } catch (error) {
        
        console.log('Database connection failed');
        process.exit(1);
    }

}

export default connectDB;