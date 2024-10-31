//tạo route
import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const userRouter = express.Router()

//users/login

//chức năng đăng ký tài khoản register {email password}
//users/register req.body(email và password)

/*
Description: Register a new user
Path: users/register
Method: POST
Body:{
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: ISO8601
}
*/

userRouter.post(
  '/register',
  registerValidator,
  wrapAsync(registerController)
  //next(error) nó sẽ chạy xún Errorhandler lun không cần try catch
)
/*
desc: login
path: users/login
method: POST
body:{
  email:string,
  password: string
}
*/
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/*
desc: logout
path: user/logout
method: POST
header: {Authorization: Bearer <access_token}
body: {
  refresh_token: tring
}
*/
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default userRouter
