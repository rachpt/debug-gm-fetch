const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = 8080

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Echo API 接口 POST
app.post('/api/echo', (req, res) => {
  console.log('Received request:', req.body)
  res.json(req.body)
})
// Echo API 接口 GET
app.get('/api/echo', (req, res) => {
  console.log('Received request:', req.query)
  res.json(req.query || { url: req.url })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
