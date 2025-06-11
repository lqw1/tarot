import { FC, useState, useMemo } from "react"
import Markdown from 'react-markdown'
import { Spin } from "antd"
import "./index.scss"

interface ResultTarotProps {
  question: string
  result?: string
  loading?: boolean
}

const ResultTarot: FC<ResultTarotProps> = ({ question, result, loading }) => {
  return (
    <Spin spinning={loading}>
      <div className="result-wrapper">
        <div className="result-title">
          <span>你的塔罗牌解读</span>
          {/* <span onClick={send}>----</span> */}
          <div style={{ marginTop: 10 }}>你想占卜的是：{question}</div>
        </div>
        <div className="result-content">
          {/* {result} */}
          <Markdown>{result}</Markdown>
        </div>
      </div>
    </Spin>
  )
}

export default ResultTarot
