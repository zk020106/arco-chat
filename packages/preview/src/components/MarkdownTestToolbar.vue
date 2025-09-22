<template>
  <div class="markdown-test-toolbar">
    <div class="toolbar-title">
      <icon-code class="toolbar-icon" />
      <span>Markdown 测试工具</span>
      <a-tag size="small" color="blue">开发模式</a-tag>
    </div>
    <div class="test-buttons">
      <a-tooltip content="基础 Markdown 语法">
        <a-button size="small" @click="testBasicMarkdown">
          <template #icon>
            <icon-file />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="代码块高亮">
        <a-button size="small" @click="testCodeBlock">
          <template #icon>
            <icon-code />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="表格渲染">
        <a-button size="small" @click="testTable">
          <template #icon>
            <icon-list />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="数学公式 (LaTeX)">
        <a-button size="small" @click="testMathFormula">
          <template #icon>
            <icon-branch />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="Mermaid 图表">
        <a-button size="small" @click="testMermaid">
          <template #icon>
            <icon-nav />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="Emoji 表情">
        <a-button size="small" @click="testEmoji">
          <template #icon>
            <icon-sun />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="复杂内容组合">
        <a-button size="small" @click="testComplex">
          <template #icon>
            <icon-apps />
          </template>
        </a-button>
      </a-tooltip>

      <a-divider direction="vertical" />

      <a-tooltip content="清空所有测试消息">
        <a-button size="small" type="outline" @click="clearAllMessages">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { Message } from '@arco-design/web-vue'
  import type { BubbleMessage } from 'arco-design-x'
  
// 定义 emits
interface Emits {
  (e: 'add-message', message: BubbleMessage): void
  (e: 'clear-all'): void
}

const emit = defineEmits<Emits>()
  
  // 生成唯一 ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)
  
  // 测试基础 Markdown
  const testBasicMarkdown = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# 基础 Markdown 测试
  
  这是一个 **粗体文本** 和 *斜体文本* 的测试。
  
  ## 列表测试
  
  ### 无序列表
  - 项目 1
  - 项目 2
    - 子项目 2.1
    - 子项目 2.2
  
  ### 有序列表
  1. 第一项
  2. 第二项
  3. 第三项
  
  ## 链接和图片
  
  [这是一个链接](https://www.example.com)
  
  ## 引用
  
  > 这是一个引用块
  > 可以包含多行内容
  
  ## 行内代码
  
  这里有一个 \`console.log('Hello World')\` 的示例。`,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加基础 Markdown 测试消息')
  }
  
  // 测试代码块
  const testCodeBlock = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# 代码块测试
  # JavaScript 代码
  \`\`\`javascript
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // 计算前 10 个斐波那契数
  for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
  }
  \`\`\`
  `,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加代码块测试消息')
  }
  
  // 测试表格
  const testTable = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# 表格测试
  
  ## 基础表格
  
  | 姓名 | 年龄 | 职业 | 城市 |
  |------|------|------|------|
  | 张三 | 25 | 工程师 | 北京 |
  | 李四 | 30 | 设计师 | 上海 |
  | 王五 | 28 | 产品经理 | 深圳 |
  | 赵六 | 32 | 数据分析师 | 杭州 |
  
  ## 复杂表格
  
  | 项目 | 状态 | 进度 | 负责人 | 截止日期 |
  |------|------|------|--------|----------|
  | 用户登录 | ✅ 完成 | 100% | 张三 | 2024-01-15 |
  | 数据统计 | 🚧 进行中 | 75% | 李四 | 2024-01-20 |
  | 支付系统 | ⏳ 待开始 | 0% | 王五 | 2024-01-25 |
  | 消息推送 | 🔄 测试中 | 90% | 赵六 | 2024-01-18 |
  
  ## 对齐表格
  
  | 左对齐 | 居中对齐 | 右对齐 |
  |:-------|:-------:|-------:|
  | 文本内容 | 文本内容 | 文本内容 |
  | 较长的文本内容 | 较长的文本内容 | 较长的文本内容 |
  | 短文本 | 短文本 | 短文本 |`,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加表格测试消息')
  }
  
  // 测试数学公式
  const testMathFormula = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# 数学公式测试
  
  ## 行内数学公式
  
  这是一个行内公式：$E = mc^2$，这是爱因斯坦的质能方程。
  
  另一个行内公式：$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$
  
  ## 块级数学公式
  
  ### 二次方程求根公式
  
  $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
  
  ### 欧拉公式
  
  $$e^{i\\pi} + 1 = 0$$
  
  ### 积分公式
  
  $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
  
  ### 矩阵表示
  
  $$\\begin{pmatrix}
  a & b \\\\
  c & d
  \\end{pmatrix}
  \\begin{pmatrix}
  x \\\\
  y
  \\end{pmatrix}
  =
  \\begin{pmatrix}
  ax + by \\\\
  cx + dy
  \\end{pmatrix}$$
  
  ### 极限公式
  
  $$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$
  
  ### 泰勒级数
  
  $$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$$
  
  ### 傅里叶变换
  
  $$\\mathcal{F}\\{f(t)\\} = \\int_{-\\infty}^{\\infty} f(t) e^{-2\\pi i \\xi t} dt$$
  
  ## 复杂数学表达式
  
  ### 薛定谔方程
  
  $$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)$$
  
  ### 麦克斯韦方程组
  
  $$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$
  
  $$\\nabla \\cdot \\mathbf{B} = 0$$
  
  $$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$
  
  $$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$$`,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加数学公式测试消息')
  }
  
  // 测试 Mermaid 图表
  const testMermaid = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# Mermaid 图表测试
  
  ## 流程图
  
  \`\`\`mermaid
  graph TD
      A[开始] --> B{是否登录?}
      B -->|是| C[显示主页]
      B -->|否| D[显示登录页]
      D --> E[用户登录]
      E --> F{登录成功?}
      F -->|是| C
      F -->|否| G[显示错误信息]
      G --> D
      C --> H[结束]
  \`\`\`
  
  ## 时序图
  
  \`\`\`mermaid
  sequenceDiagram
      participant U as 用户
      participant F as 前端
      participant B as 后端
      participant D as 数据库
      
      U->>F: 发送消息
      F->>B: API 请求
      B->>D: 查询数据
      D-->>B: 返回结果
      B-->>F: 响应数据
      F-->>U: 显示结果
  \`\`\`
  
  ## 甘特图
  
  \`\`\`mermaid
  gantt
      title 项目开发计划
      dateFormat  YYYY-MM-DD
      section 需求分析
      需求调研           :done,    des1, 2024-01-01,2024-01-05
      需求文档           :done,    des2, 2024-01-06, 3d
      section 设计阶段
      UI设计            :active,  des3, 2024-01-10, 5d
      技术方案设计        :         des4, after des3, 3d
      section 开发阶段
      前端开发           :         des5, after des4, 10d
      后端开发           :         des6, after des4, 12d
      测试              :         des7, after des5, 5d
  \`\`\`
  
  ## 类图
  
  \`\`\`mermaid
  classDiagram
      class User {
          +String name
          +String email
          +login()
          +logout()
      }
      
      class Chat {
          +String id
          +String title
          +List~Message~ messages
          +addMessage()
          +deleteMessage()
      }
      
      class Message {
          +String id
          +String content
          +String userId
          +Date timestamp
      }
      
      User ||--o{ Chat : creates
      Chat ||--o{ Message : contains
  \`\`\`
  
  ## 饼图
  
  \`\`\`mermaid
  pie title 用户设备分布
      "移动端" : 45
      "桌面端" : 35
      "平板端" : 20
  \`\`\`
  
  ## 状态图
  
  \`\`\`mermaid
  stateDiagram-v2
      [*] --> 待处理
      待处理 --> 处理中 : 开始处理
      处理中 --> 已完成 : 处理成功
      处理中 --> 失败 : 处理失败
      失败 --> 待处理 : 重试
      已完成 --> [*]
  \`\`\``,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加 Mermaid 图表测试消息')
  }
  
  // 测试 Emoji 表情
  const testEmoji = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# Emoji 表情测试
  
  ## 基础表情
  
  😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾
  
  ## 手势和身体部位
  
  👋 🤚 🖐️ ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 👊 ✊ 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻 👃 🧠 🦷 🦴 👀 👁️ 👅 👄 💋 🩸
  
  ## 人物和职业
  
  👶 🧒 👦 👧 🧑 👨 👩 🧓 👴 👵 👲 👳‍♀️ 👳‍♂️ 👳 👮‍♀️ 👮‍♂️ 👮 👷‍♀️ 👷‍♂️ 👷 💂‍♀️ 💂‍♂️ 💂 🕵️‍♀️ 🕵️‍♂️ 🕵️ 👩‍⚕️ 👨‍⚕️ 👩‍🌾 👨‍🌾 👩‍🍳 👨‍🍳 👩‍🎓 👨‍🎓 👩‍🎤 👨‍🎤 👩‍🏫 👨‍🏫 👩‍🏭 👨‍🏭 👩‍💻 👨‍💻 👩‍💼 👨‍💼 👩‍🔧 👨‍🔧 👩‍🔬 👨‍🔬 👩‍🎨 👨‍🎨 👩‍🚒 👨‍🚒 👩‍✈️ 👨‍✈️ 👩‍🚀 👨‍🚀 👩‍⚖️ 👨‍⚖️ 👰 🤵 👸 🤴 🦸‍♀️ 🦸‍♂️ 🦹‍♀️ 🦹‍♂️ 🤶 🎅 🧙‍♀️ 🧙‍♂️ 🧝‍♀️ 🧝‍♂️ 🧛‍♀️ 🧛‍♂️ 🧟‍♀️ 🧟‍♂️ 🧞‍♀️ 🧞‍♂️ 🧜‍♀️ 🧜‍♂️ 🧚‍♀️ 🧚‍♂️ 👼 🤰 🤱 🙇‍♀️ 🙇‍♂️ 💁‍♀️ 💁‍♂️ 🙅‍♀️ 🙅‍♂️ 🙆‍♀️ 🙆‍♂️ 🙋‍♀️ 🙋‍♂️ 🧏‍♀️ 🧏‍♂️ 🤦‍♀️ 🤦‍♂️ 🤷‍♀️ 🤷‍♂️ 🙎‍♀️ 🙎‍♂️ 🙍‍♀️ 🙍‍♂️ 💇‍♀️ 💇‍♂️ 💆‍♀️ 💆‍♂️ 🧖‍♀️ 🧖‍♂️
  
  ## 动物和自然
  
  🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🕸️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🐿️ 🦔
  
  ## 食物和饮料
  
  🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🥐 🥖 🫓 🥨 🥯 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🦴 🌭 🍔 🍟 🥪 🥙 🧆 🌮 🌯 🫔 🥗 🥘 🫕 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 ☕ 🫖 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🧉 🍾 🧊 🥄 🍴 🍽️ 🥣 🥡 🥢
  
  ## 活动和运动
  
  ⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🪃 🎣 🤿 🏊‍♀️ 🏊‍♂️ 🏊 🏄‍♀️ 🏄‍♂️ 🏄 🚣‍♀️ 🚣‍♂️ 🚣 🏇 🏇‍♀️ 🏇‍♂️ 🧘‍♀️ 🧘‍♂️ 🧘 🏂 🏂‍♀️ 🏂‍♂️ 🏋️‍♀️ 🏋️‍♂️ 🏋️ 🤸‍♀️ 🤸‍♂️ 🤸 🤼‍♀️ 🤼‍♂️ 🤼 🤽‍♀️ 🤽‍♂️ 🤽 🚴‍♀️ 🚴‍♂️ 🚴 🚵‍♀️ 🚵‍♂️ 🚵 🏎️ 🏍️ 🛵 🏆 🥇 🥈 🥉 🏅 🎖️ 🏵️ 🎗️ 🎫 🎟️ 🎪 🤹 🤹‍♂️ 🤹‍♀️ 🎭 🩰 🎨 🎬 🎤 🎧 🎼 🎵 🎶 🎹 🥁 🎷 🎺 🎸 🪕 🎻 🎲 ♠️ ♥️ ♦️ ♣️ 🃏 🀄 🎴 🎯 🎳 🎮 🎰 🧩
  
  ## 旅行和地点
  
  🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🏍️ 🛵 🚲 🛴 🛹 🛼 🚁 🛸 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚀 🛰️ 🚉 🚞 🚝 🚄 🚅 🚈 🚂 🚃 🚋 🚍 🚘 🚖 🚡 🚠 🚟 🎢 🎡 🎠 🎪 🎭 🎨 🎬 🎤 🎧 🎼 🎵 🎶 🎹 🥁 🎷 🎺 🎸 🪕 🎻 🎲 ♠️ ♥️ ♦️ ♣️ 🃏 🀄 🎴 🎯 🎳 🎮 🎰 🧩
  
  ## 符号和标志
  
  ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ 🕉️ ☸️ ✡️ 🔯 🕎 ☯️ ☦️ 🛐 ⛎ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ 🆔 ⚛️ 🉑 ☢️ ☣️ 📴 📳 🈶 🈚 🈸 🈺 🈷️ ✴️ 🆚 💮 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 ❌ ⭕ 🛑 ⛔ 📛 🚫 💯 💢 ♨️ 🚷 🚯 🚳 🚱 🔞 📵 🚭 ❗ ❕ ❓ ❔ ‼️ ⁉️ 🔅 🔆 〽️ ⚠️ 🚸 🔱 ⚜️ 🔰 ♻️ ✅ 🈯 💹 ❇️ ✳️ ❎ 🌐 💠 Ⓜ️ 🌀 💤 🏧 🚾 ♿ 🅿️ 🛗 🈳 🈂️ 🛂 🛃 🛄 🛅 🚹 🚺 🚼 ⚧ 🚻 🚮 🎦 📶 🈁 🔣 ℹ️ 🔤 🔡 🔠 🆖 🆗 🆙 🆒 🆕 🆓 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟`,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
    emit('add-message', message)
    Message.success('已添加 Emoji 表情测试消息')
  }
  
  // 测试复杂内容
  const testComplex = () => {
    const message: BubbleMessage = {
      id: generateId(),
      content: `# 🎨 复杂 Markdown 内容测试
  
  ## 📊 数据分析报告
  
  ### 概述
  这是一个包含多种 Markdown 元素的复杂测试内容。
  
  ### 🔍 关键指标
  
  | 指标 | 当前值 | 目标值 | 完成度 |
  |------|--------|--------|--------|
  | 用户增长 | 1,234 | 1,500 | 82.3% |
  | 转化率 | 3.2% | 4.0% | 80.0% |
  | 留存率 | 65.5% | 70.0% | 93.6% |
  
  ### 💻 代码示例
  
  \`\`\`typescript
  interface User {
    id: number;
    name: string;
    email: string;
    preferences: {
      theme: 'light' | 'dark';
      language: string;
      notifications: boolean;
    };
  }
  
  class UserService {
    private users: User[] = [];
    
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
      const newUser: User = {
        id: Date.now(),
        ...userData
      };
      
      this.users.push(newUser);
      return newUser;
    }
    
    async getUserById(id: number): Promise<User | null> {
      return this.users.find(user => user.id === id) || null;
    }
  }
  \`\`\`
  
  ### 📝 重要说明
  
  > **注意**: 这是一个重要的提示信息
  > 
  > 请确保在实施以下建议时：
  > 1. 仔细测试所有功能
  > 2. 备份现有数据
  > 3. 通知相关团队成员
  
  ### 🚀 实施步骤
  
  1. **准备阶段**
     - [ ] 环境配置
     - [ ] 依赖安装
     - [ ] 权限设置
  
  2. **开发阶段**
     - [ ] 核心功能开发
     - [ ] 单元测试编写
     - [ ] 集成测试
  
  3. **部署阶段**
     - [ ] 生产环境部署
     - [ ] 性能监控
     - [ ] 用户反馈收集
  
  ### 🔗 相关链接
  
  - [项目文档](https://docs.example.com)
  - [API 参考](https://api.example.com/docs)
  - [GitHub 仓库](https://github.com/example/project)
  
  ### 📞 联系方式
  
  如有问题，请联系：
  - 📧 Email: support@example.com
  - 💬 微信群: 扫描二维码加入
  - 📱 电话: 400-123-4567
  
  ---
  
  *最后更新时间: 2024-01-15*`,
      userId: 'assistant',
      userName: 'AI 助手',
      align: 'start',
      timestamp: Date.now(),
      markdown: true,
      avatarConfig: {
        imageUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }
  
  emit('add-message', message)
  Message.success('已添加复杂内容测试消息')
}

// 清空所有消息
const clearAllMessages = () => {
  emit('clear-all')
  Message.success('已清空所有测试消息')
}
  </script>
  
  <style scoped lang="scss">
.markdown-test-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-fill-1) 0%, var(--color-fill-2) 100%);
  border-bottom: 1px solid var(--color-border-2);
  margin-bottom: 8px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .toolbar-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-2);
    font-weight: 600;

    .toolbar-icon {
      font-size: 16px;
      color: var(--color-primary-6);
    }
  }

  .test-buttons {
    display: flex;
    gap: 6px;
    align-items: center;

    .arco-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .arco-icon {
        font-size: 16px;
      }
    }

    .arco-divider {
      margin: 0 4px;
    }
  }
}
  </style>
  