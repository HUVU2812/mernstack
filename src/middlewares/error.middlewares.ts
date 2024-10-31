// file này chứa hàm sử lí lỗi của toàn bộ server
//lỗi của validate trả về sẽ có các dạng sau
//  EntityError {status, message, errors}
//  ErrorWithStatus {status, message}
// lỗi của controller trả về:
// ErrorWithStatus {status, message}
// error bth {message, stack, name}

import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'

// lỗi từ mọi nơi đỗ về đây chưa chắc có status
export const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ErrorWithStatus) {
    res.status(error.status).json(omit(error, ['status']))
  } else {
    //còn những lỗi khác thì nó có nhìu thuộc tính mình k biết, nhung
    // có thể sẽ có stack và k có status
    //chỉnh hết các key trong object về enumerable true
    Object.getOwnPropertyNames(error).forEach((key) => {
      Object.defineProperty(error, key, { enumerable: true })
    })

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(error, ['stack']))
  }

  res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(error, ['status']))
}
