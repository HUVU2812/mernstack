import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

//hàm validate sẽ xài như sau validate(checkSchema({....}))
//và checkSchema sẽ return RunnableValidationChains<ValidationChain>
//nên mình định nghĩa validate là hàm nhận vào
//Object có dạng RunnableValidationChains<ValidationChain>

// can be reused by many routes
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //lôi thằng checkShema ra để lấy danh sách lỗi
    await validations.run(req) //funct này cũng lấy lỗi trừ req giống
    const errors = validationResult(req) //lập danh sách lỗi trong req

    //validationResult
    if (errors.isEmpty()) {
      return next()
    } else {
      const errorObject = errors.mapped()
      const entityError = new EntityError({ errors: {} })
      // duyệt qua các key trong object lỗi
      for (const key in errorObject) {
        //lấy msg trong key đó
        const { msg } = errorObject[key]
        if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          return next(msg)
        }
        entityError.errors[key] = msg
      }
      next(entityError)
    }
  }
}
