import { Request, Response } from 'express'
import User from '../models/user'
import firebase from 'firebase-admin'

const { mergeUserData } = require('../utils/users')

export const getAccessLvls = async (req: Request, res: Response) => {
  const { email } = req.params

  try {
    let user = await User.findOne({ email })
    res.json({
      accessLvls: user?.accessLvls,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `Something went wrong, could not retrieve User` }],
    })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const mongoUsers = await User.find({})
    const firebaseUsers = await firebase.auth().listUsers(1000, '1')

    const users = firebaseUsers.users.map((firebaseUser) => {
      const mongoUser = mongoUsers.find(
        (user) => user.uid.toString() === firebaseUser.uid.toString()
      )
      return mergeUserData(firebaseUser, mongoUser)
    })
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `Something went wrong, could not retrieve Users` }],
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const mongoUser = await User.findOne({ uid: id })
    const firebaseUser = await firebase.auth().getUser(id)

    const user = mergeUserData(firebaseUser, mongoUser)

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `Something went wrong, could not retrieve User` }],
    })
  }
}

export const postUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    disabled,
    type,
    address1,
    address2,
    city,
    state,
    zip,
    accessLvls,
    notes,
  } = req.body

  try {
    const firebaseUser = await firebase.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
      disabled,
    })

    const mongoUser = new User({
      uid: firebaseUser.uid,
      firstName,
      lastName,
      email,
      type,
      address1,
      address2,
      city,
      state,
      zip,
      accessLvls,
      notes,
    })

    await mongoUser.save()

    const user = mergeUserData(firebaseUser, mongoUser)
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `${error}. Creating User failed, please try again` }],
    })
  }
}

export const patchUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    disabled,
    type,
    address1,
    address2,
    city,
    state,
    zip,
    accessLvls,
    notes,
  } = req.body
  try {
    const mongoUser = await User.findOne({ uid: id })
    if (!mongoUser) {
      return res.status(500).json({
        errors: [
          {
            msg: `Something went wrong, could not find User. Please try again.`,
          },
        ],
      })
    }
    mongoUser.email = email
    mongoUser.firstName = firstName
    mongoUser.lastName = lastName
    mongoUser.type = type
    mongoUser.address1 = address1
    mongoUser.address2 = address2
    mongoUser.city = city
    mongoUser.state = state
    mongoUser.zip = zip
    mongoUser.accessLvls = accessLvls
    mongoUser.notes = notes

    const firebaseUser = await firebase.auth().updateUser(id, {
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
      email,
      disabled,
      password,
    })

    await mongoUser.save()

    const user = mergeUserData(firebaseUser, mongoUser)
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `${error}. Updating User failed, please try again` }],
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await User.findOneAndDelete({ uid: id })
    await firebase.auth().deleteUser(id)
    res.json({ msg: `User with id: ${id} has been deleted` })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      errors: [{ msg: `${error}. Deleting User failed, please try again` }],
    })
  }
}
