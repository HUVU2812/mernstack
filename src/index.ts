// dựng sever với express
import express from 'express'
import userRouter from './routes/users.routers'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const PORT = 3000
databaseServices.connect() //kết nối database
//sever dùng 1 middlieware biến đổi req dạng json
app.use(express.json())
//server dùng cái route đã tạo
app.use('/users', userRouter)
//localhost:3000/users/login
//cho users mở port ỏ 3000
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log('Server Be đang chạy port: ' + PORT)
})
