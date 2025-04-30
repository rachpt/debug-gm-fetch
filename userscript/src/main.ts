import gmFetch from '@sec-ant/gm-fetch'

// 创建UI元素
function createUI() {
  const container = document.createElement('div')
  container.className = 'container'
  container.style.marginTop = '20px'

  // 标题
  const title = document.createElement('h2')
  title.textContent = 'GM-Fetch 测试'
  container.appendChild(title)

  // 输入框
  const inputGroup = document.createElement('div')
  inputGroup.style.marginBottom = '10px'

  const label = document.createElement('label')
  label.textContent = '请输入要发送的内容：'
  label.style.display = 'block'
  label.style.marginBottom = '5px'

  const input = document.createElement('textarea')
  input.id = 'gm-fetch-input'
  input.style.width = '100%'
  input.style.height = '100px'
  input.style.padding = '8px'
  input.style.boxSizing = 'border-box'
  input.value = JSON.stringify({ message: 'Hello from GM-Fetch!' }, null, 2)

  inputGroup.appendChild(label)
  inputGroup.appendChild(input)
  container.appendChild(inputGroup)

  // 按钮
  const button = document.createElement('button')
  button.textContent = '发送请求'
  button.style.padding = '8px 16px'
  button.style.cursor = 'pointer'
  button.onclick = sendRequest
  container.appendChild(button)

  // 结果显示区域
  const resultTitle = document.createElement('h3')
  resultTitle.textContent = '响应结果：'
  resultTitle.style.marginTop = '20px'

  const resultArea = document.createElement('pre')
  resultArea.id = 'gm-fetch-result'
  resultArea.className = 'result'

  container.appendChild(resultTitle)
  container.appendChild(resultArea)

  // 添加到页面
  document.body.appendChild(container)
}

// 发送请求函数
async function sendRequest() {
  const input = document.getElementById('gm-fetch-input') as HTMLTextAreaElement
  const resultArea = document.getElementById(
    'gm-fetch-result'
  ) as HTMLPreElement

  try {
    // 解析输入内容
    let inputData
    try {
      inputData = JSON.parse(input.value)
    } catch (e) {
      // 如果不是有效的JSON，就直接使用文本
      inputData = { text: input.value }
    }

    resultArea.textContent = '请求中...'

    // 使用 GM-Fetch 发送请求
    const response = await gmFetch('http://localhost:8080/api/echo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    })

    // 解析响应
    const data = await response.json()

    // 显示结果
    resultArea.textContent = JSON.stringify(data, null, 2)
  } catch (error) {
    resultArea.textContent = `错误: ${error.message}`
    console.error('请求错误:', error)
  }
}

// 初始化
;(function () {
  console.log('GM-Fetch Debug 脚本已加载')
  createUI()
})()
