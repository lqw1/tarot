/**
 * 首页主页面，包括 塔罗牌抽取及解读的各个阶段 UI 及逻辑处理
 * 主要使用 React 函数组件和 Hooks 实现状态管理和生命周期
 * 包含 QuestionStage 输入问题阶段，PileStage 初始牌堆阶段，
 * ShufflingStage 洗牌动画阶段，CircleStage 牌面展示阶段，以及最后解读结果展示阶段
 */
import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from 'antd';
import ResultTarot from './result';
import './index.scss';
import useChat from './useChat';
import backImg from '../../assets/back.png';

const { TextArea } = Input;

const SHUFFLE_COUNT = 30; // 洗牌时显示的牌数
const CARD_COUNT = 78; // 塔罗牌总数
const tarotImagesEnum = [
  "星币王后", "星币侍从", "星币骑士", "星币国王", "星币10", "星币9", "星币8", "星币7", "星币6", "星币5", "星币4", "星币3", "星币2", "星币01",
  "圣杯王后", "圣杯侍从", "圣杯骑士", "圣杯国王", "圣杯10", "圣杯9", "圣杯8", "圣杯7", "圣杯6", "圣杯5", "圣杯4", "圣杯3", "圣杯2", "圣杯1",
  "权杖王后", "权杖侍从", "权杖骑士", "权杖国王", "权杖10", "权杖9", "权杖8", "权杖7", "权杖6", "权杖5", "权杖4", "权杖3", "权杖2", "权杖1",
  "宝剑王后", "宝剑侍从", "宝剑骑士", "宝剑国王", "宝剑10", "宝剑9", "宝剑8", "宝剑7", "宝剑6", "宝剑5", "宝剑4", "宝剑3", "宝剑2", "宝剑1",
  "世界", "审判", "太阳", "月亮", "星星", "高塔", "恶魔", "节制", "死神", "吊人", "正义", "命运之轮", "隐士", "力量", "战车", "恋人", "教皇", "皇帝", "女皇", "女祭司", "魔术师", "愚人"
];
const tarotImages = tarotImagesEnum.map(name => require(`../../assets/tarot/${name}.jpg`));

/**
 * 问题输入阶段组件
 * 展示输入框和开始按钮，接收用户问题文本输入及开始抽牌操作
 */
function QuestionStage({ question, setQuestion, onStart }) {
  return (
    <div className='question-wrapper'>
      <div className='question-title'>
        <span>请在输入你的问题</span>
      </div>
      <div className='question-input'>
        <TextArea rows={4} value={question} onChange={e => setQuestion(e.target.value)} />
      </div>
      <Button className='question-button' type='primary' onClick={onStart}>开始</Button>
      <p className='question-tips'>1.不能问"多久"、"多长" 等等时间问题, 最好固定一个半年内 或者 具体事务</p>
      <p className='question-tips'>2.生成结果有点慢，请耐心等待</p>
    </div>
  );
}

/**
 * 初始牌堆阶段组件
 * 展示牌背面堆叠图片，点击开始洗牌动画阶段
 */
function PileStage({ onShuffle }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.img
        src={backImg}
        alt=""
        className="center-pile"
        initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
        animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
        transition={{ duration: 0.6 }}
        onClick={onShuffle}
        style={{ cursor: 'pointer' }}
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          marginTop: '16rem',
          color: '#fff',
          fontSize: '1.2rem',
          letterSpacing: '0.2rem',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          zIndex: 20
        }}
      >
        点击卡牌洗牌
      </motion.div>
    </div>
  );
}

/**
 * 洗牌动画阶段组件
 * 通过 framer-motion 动态渲染多张牌背，随机旋转和平移动画效果，实现洗牌感
 */
/**
 * 重新设计的洗牌动画：牌堆整体绝对居中，牌间距固定，缩放与左右晃动表现洗牌效果
 */
/**
 * 切牌动画效果
 * 牌依次从堆顶水平切开，出现切开动作并展示最后几张牌依次亮起
 */
function ShufflingStage() {
  // 减少牌数以提升动画性能和视觉清晰度
  const DISPLAY_COUNT = 8; // 进一步减少牌数提升流畅度
  const shuffleCards = useMemo(() => Array.from({ length: DISPLAY_COUNT }), []);
  const cardWidth = 100;
  const cardHeight = 154;
  const mid = Math.floor(DISPLAY_COUNT / 2);

  return (
    <>
      {shuffleCards.map((_, i) => {
        const isTop = i >= mid;
        
        return (
          <motion.img
            key={i}
            src={backImg}
            alt=""
            className="shuffle-card"
            // 使用 willChange 告知浏览器提前开启硬件加速
            // 使用 transform 相关的属性 (x, y, scale, rotate) 而不是布局属性 (top, left, margin) 来进行动画
            initial={{ x: 0, y: -i * 0.5, rotate: 0, opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [
                0,
                isTop ? -120 : 120,
                i % 2 === 0 ? 30 : -30,
                i % 2 === 0 ? -30 : 30,
                0
              ],
              y: [
                -i * 0.5,
                isTop ? -40 : 0,
                0,
                0,
                -i * 0.5
              ],
              rotate: [
                0,
                isTop ? -12 : 12,
                0,
                0,
                0
              ],
            }}
            transition={{
              duration: 3.5,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeInOut",
              delay: i * 0.02, // 减小延迟让动画更紧凑连贯
            }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              marginTop: `-${cardHeight / 2}px`,
              marginLeft: `-${cardWidth / 2}px`,
              zIndex: i,
              boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
              borderRadius: '10px',
              border: '2px solid white',
              willChange: 'transform, opacity', // 开启硬件加速
              pointerEvents: 'none'
            }}
          />
        );
      })}
    </>
  );
}

/**
 * 塔罗牌半圆排列及交互阶段组件
 * 生成78张牌的半圆布局，支持点击选牌，包含中央放大的显示动画及选中牌展示按钮
 */
function CircleStage({ onCardClick, showingCard, selectedCards, selectedCardsName, selectedCardsPosition, handleUnscramble, removedIndexes }) {
  const CARD_COUNT = 78;
  const isMobile = window.innerWidth < 768;
  
  // 响应式参数
  // PC端外层容器宽度被限制在 25rem (约400px)，所以半径和角度需要严格控制
  const radius = isMobile ? 160 : 150;
  const cardWidth = isMobile ? 45 : 42;
  const cardHeight = isMobile ? 70 : 66;
  const topPos = isMobile ? '15%' : '10%';

  return (
    <div className="circle-stage-container" style={{ overflow: 'hidden' }}>
      {/* 背景遮罩，展示卡牌时变暗 */}
      <AnimatePresence>
        {showingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="stage-overlay"
          />
        )}
      </AnimatePresence>

      <div className="circle-cards">
        {Array.from({ length: CARD_COUNT }).map((_, i) => {
          const isRemoved = removedIndexes.includes(i);
          // 计算扇形角度：进一步收窄角度范围以确保在 25rem 宽度内不溢出
          const startAngle = isMobile ? -155 : -135;
          const endAngle = isMobile ? -25 : -45;
          const angleDeg = startAngle + (i / (CARD_COUNT - 1)) * (endAngle - startAngle);
          const angleRad = (angleDeg * Math.PI) / 180;
          
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius + radius; // 向上偏移

          return (
            <motion.div
              key={i}
              className="circle-card-wrapper"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
              animate={{
                x: isRemoved ? 0 : x,
                y: isRemoved ? 0 : y,
                rotate: isRemoved ? 0 : angleDeg + 90,
                opacity: isRemoved ? 0 : 1,
                zIndex: i
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                delay: i * 0.01
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: topPos,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                marginLeft: `-${cardWidth / 2}px`,
                marginTop: `-${cardHeight / 2}px`,
                perspective: '1000px',
              }}
            >
              {!isRemoved && (
                <motion.img
                  src={backImg}
                  alt=""
                  className="circle-card"
                  onClick={() => onCardClick(i)}
                  whileHover={{ y: -15, transition: { duration: 0.2 } }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showingCard && (
          <div className="center-card-container">
            <motion.div
              className="card-3d-wrapper"
              initial={{
                scale: 0.5,
                x: '-50%',
                y: '100%',
                rotateY: 0,
                rotateZ: 0,
                opacity: 0
              }}
              animate={{
                scale: 1,
                x: '-50%',
                y: '-50%',
                rotateY: 180,
                opacity: 1
              }}
              exit={{
                scale: 0.5,
                x: '-50%',
                y: '-100%',
                opacity: 0
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1] // 贝塞尔曲线，带点弹性
              }}
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                width: isMobile ? 160 : 200,
                height: isMobile ? 250 : 312,
                zIndex: 10000,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 卡牌正面 */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  border: '4px solid gold'
                }}
              >
                <img src={showingCard} alt="front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* 卡牌背面 */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  border: '4px solid white'
                }}
              >
                <img src={backImg} alt="back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {selectedCards.length === 3 && (
        <div className='cards-choose-button'>
          <Button type='primary' onClick={handleUnscramble}>去解读</Button>
        </div>
      )}
      <div className='cards-choose'>
        {[0, 1, 2].map((idx) => (
          <div key={idx}>
            <div className="result-slot">
              {selectedCards[idx] && (
                <img
                  src={selectedCards[idx]}
                  alt=""
                  className="result-img"
                  style={{ transform: selectedCardsPosition[idx] === '逆位' ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
                />
              )}
            </div>
            <span className='card-name'>
              {selectedCardsName[idx]}{selectedCardsPosition[idx] && ` (${selectedCardsPosition[idx]})`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 首页主组件，管理应用不同阶段的状态及交互逻辑
 * 包括输入问题，洗牌，牌面展示，结果解读
 */
const Home: FC = () => {
  const [stage, setStage] = useState<'question' | 'pile' | 'shuffling' | 'circle' | 'result'>('question');
  const [selectedCards, setSelectedCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [selectedCardsName, setSelectedCardsName] = useState([]);
  const [selectedCardsPosition, setSelectedCardsPosition] = useState([]);
  const [showingCard, setShowingCard] = useState(null);
  const [removedIndexes, setRemovedIndexes] = useState([]);

  const { send, sendSSE, result, loading } = useChat({ selectedCardsName, selectedCardsPosition, question });

  // 牌面点击逻辑，限制最多选3张，不重复点击同一张
  const handleCardClick = useCallback((idx) => {
    if (showingCard) return;
    if (selectedCards.length === 3 || removedIndexes.includes(idx)) return;
    setRemovedIndexes(prev => [...prev, idx]);
    let available = tarotImages.filter(img => !selectedCards.includes(img));
    const randomIdx = Math.floor(Math.random() * available.length);
    let randomImg = available[randomIdx];
    const isReversed = Math.random() > 0.5;
    setShowingCard(randomImg);
    // 延长展示时间，让用户有更充裕的时间看清卡牌及其 3D 翻转效果
    setTimeout(() => {
      setShowingCard(null);
      setSelectedCards(prev => [...prev, randomImg]);
      setSelectedCardsName(prev => [...prev, tarotImagesEnum[randomIdx]]);
      setSelectedCardsPosition(prev => [...prev, isReversed ? '逆位' : '正位']);
    }, 2000);
  }, [selectedCards, removedIndexes, showingCard]);

  // 点击“去解读”按钮，进入结果阶段，调用后端接口
  const handleUnscramble = useCallback(() => {
    setStage('result');
    sendSSE();
  }, [sendSSE]);

  // 洗牌阶段定时切换到半圆排布阶段
  useEffect(() => {
    if (stage === 'shuffling') {
      // 动画总时长 3.5s，预留一点缓冲时间
      const timer = setTimeout(() => setStage('circle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1d2045', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <div className="home-wrapper">
        {stage === 'question' && <QuestionStage question={question} setQuestion={setQuestion} onStart={() => setStage('pile')} />}
        {stage === 'pile' && <PileStage onShuffle={() => setStage('shuffling')} />}
        {stage === 'shuffling' && <ShufflingStage />}
        {stage === 'circle' && (
          <CircleStage
            onCardClick={handleCardClick}
            showingCard={showingCard}
            selectedCards={selectedCards}
            selectedCardsName={selectedCardsName}
            selectedCardsPosition={selectedCardsPosition}
            handleUnscramble={handleUnscramble}
            removedIndexes={removedIndexes}
          />
        )}
        {stage === 'result' && <ResultTarot question={question} loading={loading} result={result} />}
      </div>
    </div>
  );
};

export default Home;