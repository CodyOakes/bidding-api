import express from 'express'
const router = express.Router()

const { authentication, authorization } = require('../middleware/auth')

const {
  getAccessLvls,
  getUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require('../controller/users')

router.get('/accesslvls/:email', authentication, getAccessLvls)

router.get('/', authentication, authorization('users_read'), getUsers)
router.get('/:id', authentication, authorization('users_read'), getUser)
router.post('/', authentication, authorization('users_write'), postUser)
router.patch('/:id', authentication, authorization('users_write'), patchUser)
router.delete('/:id', authentication, authorization('users_delete'), deleteUser)

export default router
