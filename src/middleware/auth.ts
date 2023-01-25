import { Request, Response, NextFunction } from 'express'
const { firebase } = require('../config/firebase')
const User = require('../models/user')

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userEmail: string
      userFirstName: string
      userLastName: string
      userId: string
    }
  }
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.token
  if (!authToken) {
    res.status(403).json({
      errors: [
        {
          msg: `Please Sign In to perform that function.`,
        },
      ],
    })
  }
  try {
    let user = await firebase.auth().verifyIdToken(authToken)
    req.userEmail = user.email
    next()
  } catch (error) {
    console.error(error)
    res.status(403).json({
      errors: [
        {
          msg: `Please Sign In to perform that function.`,
        },
      ],
    })
  }
}

export const authorization =
  (requiredAccess: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = await User.findOne({ email: req.userEmail })
      if (!user.accessLvls) {
        return res.status(401).json({
          errors: [
            { msg: `Sorry! You are not authorized to preform that function.` },
          ],
        })
      }
      if (!user.accessLvls.includes(requiredAccess)) {
        return res.status(401).json({
          errors: [
            { msg: `Sorry! You are not authorized to preform that function.` },
          ],
        })
      }
      req.userFirstName = user.firstName || ''
      req.userLastName = user.lastName || ''
      next()
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        errors: [
          {
            msg: `Something went wrong could not find User with id: ${req.userId}`,
          },
        ],
      })
    }
  }
