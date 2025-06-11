import { useState, useMemo } from "react"
import { message } from "antd";
import { sendChat } from "../../services/modules/chat/chat.service"

interface ChatTarotProps {
  selectedCardsName: string[]
  selectedCardsPosition: string[]
  question: string
}

const useChat = ({selectedCardsName, selectedCardsPosition, question} : ChatTarotProps) => {
  // const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(selectedCardsPosition, selectedCardsName, '009')
  const tarots = useMemo(() => {
    return selectedCardsName.map((name, index) => {
      return `${name}(${selectedCardsPosition[index]})`
    })
  }, [selectedCardsName, selectedCardsPosition])

  // console.log(tarots, 'TTTT')

  const send = async () => {
    setLoading(true);
    try {
      const result = await sendChat({ message: `
        我现在进行塔罗牌占卜，我会给出我的问题和抽到的卡牌，你来帮我解牌
        1.问题：${question}
        2.我的三张牌分别是${tarots.join(',')}`
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
  }
}

export default useChat;