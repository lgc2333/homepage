const LINKS = [
  'https://www.bilibili.com/video/BV1GJ411x7h7/',
  'https://www.bilibili.com/video/BV1wT411m7er/',
  'https://www.bilibili.com/video/BV1WK4y1Q7iS/',
  'https://www.bilibili.com/video/BV1uM4y1F72p/',
  'https://www.bilibili.com/video/BV1SD4y1J7uY/',
  'https://www.bilibili.com/video/BV13m4y1D7kT/',
  'https://www.bilibili.com/video/BV1iJ411J7f5/',
];

/**
 * @param {number} max
 * @returns {number}
 */
function randMax(max) {
  return Math.floor(Math.random() * (max + 1));
}

/**
 * @param {any[]} list
 * @returns {string}
 */
function choose(list) {
  const index = randMax(list.length - 1);
  return list[index];
}

function roll() {
  const date = new Date();
  if (!(date.getMonth() === 3 && date.getDate() === 1)) {
    localStorage.removeItem('rolled');
    return;
  }

  // 第一次必定触发，之后 50% 概率
  if (!localStorage.getItem('rolled') || randMax(99) >= 50) {
    localStorage.setItem('rolled', '1');
    const link = choose(LINKS);
    window.location.href = link;
  }
}

roll();
