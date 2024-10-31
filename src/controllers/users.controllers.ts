import { NextFunction, Request, Response } from 'express'
import { LoginReqBody, LogoutReqbody, RegisterReqBody, TokenPayload } from '~/models/requests/User.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
// import { ParamsDictionary } from 'express-serve-static-core'
//controller là handler điều phối các dữ liệu vào đúng các service xử lý trích
// xuất dữ liệu với server

// controller là nơi xử lý logic, dữ liệu khi đến tầng này thì phải clean

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body
  //tạo user và lưu vào database
  //ktra xam email đã có trong database hay chưa?
  //gọi database tạo user từ email và password lưu vào collection users
  const isEmailExist = await usersServices.checkEmailExist(email)
  if (isEmailExist) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }
  const result = await usersServices.register(req.body)

  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  //dùng email và password để tìm
  const result = await usersServices.login({ email, password })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result // có acc và rf
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqbody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  //vào đến đây thì nghĩa là 2 token là do mình ký ra
  // xem thử là thông tin user_id trong payload của access
  // và user_id trong payload của refresh có phải là 1 ko?
  const { user_id: user_id_at } = req.decode_authorization as TokenPayload
  const { user_id: user_id_rf } = req.decode_refresh_token as TokenPayload
  //chặn việc nó gửi 2 mã của 2 thằng khác nhau
  if (user_id_at != user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
    })
  }
  //nó gửi một cái refresh_token cũ và k còn tồn tại trong database nữa
  //vào database tìm xem document nào chứa refresh_token này và có phải user_id đó k
  await usersServices.checkRefreshToken({ user_id: user_id_rf, refresh_token })
  //nếu mà có thì mới xóa khỏi database
  await usersServices.logout(refresh_token)
  //nếu code xuống đc đây mượt, k có con bug nào thì
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
