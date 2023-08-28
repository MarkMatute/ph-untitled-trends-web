import mongoose from 'mongoose';

let isConnected  = false;

export async function connectToDatabase() {
  mongoose.set('strictQuery', true);

  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.warn('No mongodb url found.');
    return;
  }

  if (isConnected) {
    console.log('Already connected...');
    return;
  }

  try {
    await mongoose.connect(mongoDbUrl);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }

}
