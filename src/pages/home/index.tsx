import { FC, useState, useEffect } from 'react';
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
]

const tarotImages = tarotImagesEnum.map(name => require(`../../assets/tarot/${name}.jpg`));

const Home: FC = () => {
  // 阶段控制：pile（初始堆叠）、shuffling（洗牌）、circle（半圆排布）
  const [stage, setStage] = useState<'question' | 'pile' | 'shuffling' | 'circle' | 'result'>('question');
  const [selectedCards, setSelectedCards] = useState([]); // 最多3张
  const [question, setQuestion] = useState('');
  const [selectedCardsName, setSelectedCardsName] = useState([]); // 最多3张
  const [selectedCardsPosition, setSelectedCardsPosition] = useState([]); // 记录正逆位
  const [showingCard, setShowingCard] = useState(null);   // 当前中央展示的牌
  const [removedIndexes, setRemovedIndexes] = useState([]); // 已被点击移除的U型卡牌索引

  console.log(selectedCards, 'selectedCards')

  const { send, sendSSE, result, loading } = useChat({ selectedCardsName, selectedCardsPosition, question });

  const handleCardClick = (idx) => {
    if (showingCard) return; // 动画期间禁止点击
    if (selectedCards.length === 3 || removedIndexes.includes(idx)) return;
    setRemovedIndexes(prev => [...prev, idx]);
    // 随机抽取未被抽过的牌
    let available = tarotImages.filter(img => !selectedCards.includes(img));
    const randomIdx = Math.floor(Math.random() * available.length);
    let randomImg = available[randomIdx];
    // 随机正逆位
    const isReversed = Math.random() > 0.5;
    setShowingCard(randomImg);
    setTimeout(() => {
      setShowingCard(null);
      setSelectedCards(prev => [...prev, randomImg]);
      setSelectedCardsName(prev => [...prev, tarotImagesEnum[randomIdx]]);
      setSelectedCardsPosition(prev => [...prev, isReversed ? '逆位' : '正位']);
    }, 1000);
  };

  const handleUnscramble = () => {
    setStage('result')
    // send();
    sendSSE()
  }

  // 洗牌动画参数
  const shuffleCards = Array.from({ length: SHUFFLE_COUNT });

  // 洗牌动画结束后自动切换到circle阶段
  useEffect(() => {
    if (stage === 'shuffling') {
      const timer = setTimeout(() => setStage('circle'), 1200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // console.log(stage, 'stage')

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1d2045', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <div className="home-wrapper">
        { stage === 'question' && (
          <div className='question-wrapper'>
            <div className='question-title'>
              <span>请在输入你的问题</span>
            </div>
            <div className='question-input'>
              <TextArea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <Button className='question-button' type='primary' onClick={() => setStage('pile')}>开始</Button>
            <p className='question-tips'>
              1.不能问"多久"、"多长" 等等时间问题, 最好固定一个半年内 或者 具体事务
            </p>
             <p className='question-tips'>
              2.生成结果有点慢，请耐心等待
            </p>
          </div>
        ) }
        {/* 初始牌堆 */}
        {stage === 'pile' && (
          <motion.img
            src={backImg}
            alt=""
            className="center-pile"
            initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.6 }}
            onClick={() => setStage('shuffling')}
          />
        )}

        {/* 洗牌动画 */}
        <AnimatePresence>
          {stage === 'shuffling' && (
            <div>
              {shuffleCards.map((_, i) => {
                // 随机角度和位置
                const angle = Math.random() * 60 - 30; // -30~30度
                const x = Math.random() * 8 - 4; // -4~4 rem
                const y = Math.random() * 6 - 3; // -3~3 rem
                return (
                  <motion.img
                    key={i}
                    src={backImg}
                    alt=""
                    className="shuffle-card"
                    initial={{
                      left: '50%',
                      top: '50%',
                      x: '-50%',
                      y: '-50%',
                      rotate: 0,
                      position: 'absolute',
                      zIndex: i,
                      opacity: 0.7
                    }}
                    animate={{
                      x: `calc(-50% + ${x}rem)` ,
                      y: `calc(-50% + ${y}rem)` ,
                      rotate: angle,
                      opacity: 1
                    }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.03
                    }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* 半圆排布 -> U型排布 */}
        {stage === 'circle' && (
          <div>
            <div className="circle-cards">
              {(() => {
                const CARD_COUNT = 78;
                const cardWidth = 60;
                const cardHeight = 94;
                const verticalHeight = 80;
                const radius = 130;
                const verticalRatio = 0.15;
                let tops = '40%'
                const arcRatio = 1 - verticalRatio * 2;
                const cards = Array.from({ length: CARD_COUNT });
                return cards.map((_, i) => {
                  const t = i / (CARD_COUNT - 1); // 0~1
                  let x = 0, y = 0, rotate = 0;
                  if (t < verticalRatio) {
                    // 左竖直
                    const percent = t / verticalRatio;
                    const angle = -Math.PI; // -180°
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius - verticalHeight / 2 + percent * verticalHeight;
                  } else if (t > 1 - verticalRatio) {
                    // 右竖直
                    const percent = (t - (1 - verticalRatio)) / verticalRatio;
                    const angle = 0; // 0°
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius - verticalHeight / 2 + percent * verticalHeight;
                  } else {
                    // 顶部半圆
                    const percent = (t - verticalRatio) / arcRatio;
                    const angle = -Math.PI + percent * Math.PI; // -π ~ 0
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius - verticalHeight / 2;
                  }
                  return (
                    <img
                      key={i}
                      src={backImg}
                      alt=""
                      className="circle-card"
                      onClick={handleCardClick}
                      style={{
                        left: '50%',
                        top: tops,
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` ,
                        zIndex: i,
                      }}
                    />
                  );
                });
              })()}
            </div>
            <AnimatePresence>
              {showingCard && (
                <motion.img
                  key={showingCard}
                  src={showingCard}
                  className="center-show-card"
                  initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                  animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                  exit={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    width: 120,
                    height: 180,
                    zIndex: 9999,
                    borderRadius: 10,
                    boxShadow: '0 8px 32px #000a',
                    background: '#fff',
                  }}
                />
              )}
            </AnimatePresence>
            {
              selectedCards.length === 3 && (
                <div className='cards-choose-button'>
                  <Button type='primary' onClick={handleUnscramble}>去解读</Button>
                </div>
              )
            }
            <div className='cards-choose'>
              {[0, 1, 2].map((idx) => (
                <div key={idx}>
                  <div className="result-slot">
                    {selectedCards[idx] && (
                      <img 
                        src={selectedCards[idx]} 
                        alt="" 
                        className="result-img" 
                        style={{ 
                          transform: selectedCardsPosition[idx] === '逆位' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    )}
                  </div>
                  <span className='card-name'>
                    {selectedCardsName[idx]}
                    {selectedCardsPosition[idx] && ` (${selectedCardsPosition[idx]})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {
          stage === 'result' && (
            <ResultTarot question={question} loading={loading} result={result} />
          )
        }
      </div>
    </div>
  );
};

export default Home;