import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface UserSchemaTypes extends mongoose.Document {
  uid: string
  email: string
  type: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  accessLvls: string[]
  notes: string
}

const userSchema = new mongoose.Schema({
  uid: { type: String, index: true, require: true },
  email: { type: String, index: true, unique: true, require: true },
  type: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  accessLvls: [{ type: String }],
  notes: { type: String },
})

userSchema.plugin(uniqueValidator)

export default mongoose.model<UserSchemaTypes>('User', userSchema)
