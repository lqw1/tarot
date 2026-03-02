/**
 * flexibleRem.ts - 解决移动端和PC端rem适配问题
 * 
 * 思路：
 * - 监听窗口尺寸变化，动态调整html根元素font-size
 * - 移动端以设计稿375宽为基准，PC端以设计稿1440宽为基准，基准字体16px
 * - 保证设计稿尺寸对应的rem换算一致
 */

function flexibleRem() {
  const baseFontSize = 16; // 根字体大小基准，单位px
  const mobileDesignWidth = 375;
  const pcDesignWidth = 1440;
  const mobileMaxWidth = 768; // 屏幕宽度768以下视为移动端
  const pcMaxWidth = 1920;    // PC端最大宽度限制，防止极大屏字体过大

  function updateFontSize() {
    const docEl = document.documentElement;
    const screenWidth = docEl.clientWidth;

    if (!screenWidth) return;

    let fontSize = 0;

    if (screenWidth <= mobileMaxWidth) {
      fontSize = (screenWidth / mobileDesignWidth) * baseFontSize;
    } else {
      const width = screenWidth > pcMaxWidth ? pcMaxWidth : screenWidth;
      fontSize = (width / pcDesignWidth) * baseFontSize;
    }

    // 保留两位小数
    fontSize = Math.round(fontSize * 100) / 100;
    docEl.style.fontSize = fontSize + 'px';
  }

  window.addEventListener('resize', updateFontSize);
  window.addEventListener('orientationchange', updateFontSize);

  updateFontSize(); // 初始化执行一次
}

export default flexibleRem;