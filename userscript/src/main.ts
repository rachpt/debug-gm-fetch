import gmFetch from '@sec-ant/gm-fetch'

// 获取GM-Fetch版本号的函数
function getGmFetchVersion(): string {
  try {
    // @ts-ignore
    if (typeof GM_info !== 'undefined') {
      // @ts-ignore
      const description = GM_info.script.description
      const match = description.match(/@sec-ant\/gm-fetch@(\d+\.\d+\.\d+)/)
      return match ? match[1] : '未知'
    }
    return '未知'
  } catch (e) {
    console.error('获取版本号失败:', e)
    return '未知 (请查看package.json)'
  }
}

// 创建UI元素
function createUI() {
  const container = document.createElement('div')
  container.className = 'container'
  container.style.marginTop = '20px'

  // 显示版本号
  const versionInfo = document.createElement('div')
  versionInfo.style.marginBottom = '15px'
  versionInfo.style.padding = '8px'
  versionInfo.style.backgroundColor = '#e9f5ff'
  versionInfo.style.borderRadius = '4px'
  versionInfo.innerHTML = `当前使用的 <strong>@sec-ant/gm-fetch</strong> 版本: <code>${getGmFetchVersion()}</code>`
  container.appendChild(versionInfo)

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

  // 请求方法选择
  const methodGroup = document.createElement('div')
  methodGroup.style.marginBottom = '15px'

  const methodLabel = document.createElement('label')
  methodLabel.textContent = '请求方法：'
  methodLabel.style.marginRight = '10px'

  const postRadio = document.createElement('input')
  postRadio.type = 'radio'
  postRadio.name = 'requestMethod'
  postRadio.id = 'method-post'
  postRadio.value = 'POST'
  postRadio.checked = true
  postRadio.style.marginRight = '5px'

  const postLabel = document.createElement('label')
  postLabel.htmlFor = 'method-post'
  postLabel.textContent = 'POST'
  postLabel.style.marginRight = '15px'

  const getRadio = document.createElement('input')
  getRadio.type = 'radio'
  getRadio.name = 'requestMethod'
  getRadio.id = 'method-get'
  getRadio.value = 'GET'
  getRadio.style.marginRight = '5px'

  const getLabel = document.createElement('label')
  getLabel.htmlFor = 'method-get'
  getLabel.textContent = 'GET'

  methodGroup.appendChild(methodLabel)
  methodGroup.appendChild(postRadio)
  methodGroup.appendChild(postLabel)
  methodGroup.appendChild(getRadio)
  methodGroup.appendChild(getLabel)

  container.appendChild(methodGroup)

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
  const methodRadios = document.getElementsByName(
    'requestMethod'
  ) as NodeListOf<HTMLInputElement>
  const method =
    Array.from(methodRadios).find((radio) => radio.checked)?.value || 'POST'

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

    let response

    if (method === 'GET') {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      Object.entries(inputData).forEach(([key, value]) => {
        queryParams.append(key, String(value))
      })

      // 使用 GM-Fetch 发送 GET 请求
      response = await gmFetch(
        `http://localhost:8080/api/echo?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      )
    } else {
      // 使用 GM-Fetch 发送 POST 请求
      response = await gmFetch('http://localhost:8080/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      })
    }

    // 解析响应
    const data = await response.json()

    // 显示结果
    resultArea.textContent = JSON.stringify(data, null, 2)
  } catch (error: any) {
    resultArea.textContent = `错误: ${error.message}`
    console.error('请求错误:', error)
  }
}

// 初始化
;(function () {
  console.log('GM-Fetch Debug 脚本已加载')
  createUI()
})()
