import mongoose from 'mongoose'

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}/?retryWrites=true&w=majority`

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(connectionString)
    console.info('MongoDB Connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB
