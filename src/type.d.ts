import { Request } from 'express'
import { TokenPayload } from './models/requests/User.requests'
declare module 'express' {
  interface Request {
    decode_authorization?: TokenPayload
    decode_refresh_token?: TokenPayload
  }
}
