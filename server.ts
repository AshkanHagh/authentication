import { app } from './app';
import connectDB from './db/connectDB';

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});