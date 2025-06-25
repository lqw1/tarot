import { useState, useMemo } from "react"
import { message } from "antd"
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { sendChat } from "../../services/modules/chat/chat.service"

interface ChatTarotProps {
  selectedCardsName: string[]
  selectedCardsPosition: string[]
  question: string
}

const getDate = () => {
  return new Date().toLocaleDateString();
}

const useChat = ({ selectedCardsName, selectedCardsPosition, question }: ChatTarotProps) => {
  // const [message, setMessage] = useState('');
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const tarots = useMemo(() => {
    return selectedCardsName.map((name, index) => {
      return `${name}(${selectedCardsPosition[index]})`
    })
  }, [selectedCardsName, selectedCardsPosition])

  

  // console.log(tarots, 'TTTT')
  const sendSSE = async () => {
    setLoading(true)
    setResult("") // 可选：每次请求前清空结果
    let hasFirstText = false
    const baseUrl = process.env.REACT_APP_API_BASE_URL || ''
      await fetchEventSource(`${baseUrl}/api/chat-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
        帮我详细介绍每张牌，我希望你给至少包含：出牌阵结构与象征意义、分牌深度解析、关键矛盾与建议、最终启示这几项。如果你给出的结果中包含年份、日期的指示，请注意现在的日期是${getDate()}
        1.问题：${question}
        2.我的三张牌分别是${tarots.join(",")}`,
        }),
        onmessage(ev) {
          if (ev.event === 'end') {
                console.log('Stream finished.');
                // 在这里可以关闭连接
                // 注意：这个库需要一个控制器来手动关闭
                return; 
            }
          if (ev.event === 'error') {
              const errorData = JSON.parse(ev.data);
              console.error('Backend error:', errorData.error);
              throw new Error(errorData.error);
          }
          try {
            const data = JSON.parse(ev.data)
            setResult((text) => text + data.text)
            if (!hasFirstText && data.text) {
              setLoading(false)
              hasFirstText = true
            }
          } catch (e) {
            // 解析失败可忽略
          }
        },
        onerror(err) {
          setLoading(false)
          message.error("SSE 连接出错")
          throw err
        },
        onclose() {
          // 可选：连接关闭时的处理
        },
        openWhenHidden: true,
      })
  }

  const send = async () => {
    setLoading(true)
    try {
      const result = await sendChat({
        message: `
        帮我详细介绍每张牌，我希望你给至少包含：出牌阵结构与象征意义、分牌深度解析、关键矛盾与建议、最终启示这几项
        1.问题：${question}
        2.我的三张牌分别是${tarots.join(",")}`,
      })

      // 添加 AI 响应到历史记录
      // const aiMessage = {
      //   role: "assistant",
      //   content: result.data.choices[0].message.content,
      // }
      // setResponse("")

      // console.log(result.choices[0].message.content, 123)
      setResult(result.choices[0].message.content)
      // console.log(result)
    } catch (error) {
      message.error(error.response?.data?.details || "请求失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return {
    send,
    loading,
    result,
    sendSSE,
  }
}

export default useChat
