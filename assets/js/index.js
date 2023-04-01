let bgUrl = null;
let changing = false;

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function changeBG() {
  /** @type {HTMLAnchorElement} */
  const bgInfoA = document.getElementById('bg-info');
  /** @type {HTMLAnchorElement} */
  const changeElem = document.getElementById('change');

  const task = async () => {
    if (bgUrl) URL.revokeObjectURL(bgUrl);

    // 原api没法过cors 我用cf workers反代了
    const params = new URLSearchParams({
      num: 10,
      proxy: 'fuck-cors.lgc2333.top',
      tag: '萝莉|少女',
      excludeAI: 1,
    });
    const apiUrl = `https://fuck-cors.lgc2333.top/setu/v2?${params}`;
    const res = await fetch(apiUrl, {
      headers: { 'upstream-host': 'api.lolicon.app' },
    });
    let { data } = await res.json();
    // console.log(data);

    // 屏幕比例小于3：4用竖屏图，否则横屏
    // 如果没有筛选到指定尺寸的图，那么直接用返回的第一个图
    const { innerWidth, innerHeight } = window;
    const isPortrait = innerWidth / innerHeight <= 3 / 4;
    const filteredData = data.filter((v) => {
      const { width, height } = v;
      let result = width >= height; // 是否横屏
      if (isPortrait) result = !result;
      return result;
    });
    if (filteredData.length > 0) data = filteredData;
    const selectedPic = data[0];
    const picUrl = selectedPic.urls.original;

    // get pic
    const picRes = await fetch(picUrl, {
      headers: {
        'upstream-host': 'i.pximg.net',
        'real-referer': 'https://www.pixiv.net/',
      },
    });
    const imgType = picRes.headers.get('content-type');
    if (!imgType || !imgType.includes('image'))
      throw new TypeError(`返回数据类型不对 (${imgType})`);

    bgUrl = URL.createObjectURL(await picRes.blob());

    // animation
    const bgElement = document.getElementById('bg');
    bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;

    // wait animation
    await new Promise((resolve) => {
      bgElement.addEventListener('animationend', resolve, { once: true });
    });

    bgElement.style.backgroundImage = `url("${bgUrl}")`;
    bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

    // show pic info
    bgInfoA.innerText = selectedPic.title;
    bgInfoA.href = `https://www.pixiv.net/artworks/${selectedPic.pid}`;
  };

  if (changing) return;

  changing = true;
  changeElem.href = '#';
  bgInfoA.href = '#';
  bgInfoA.innerText = 'Loading~';

  try {
    await task();
  } catch (e) {
    console.log(e);
    await sleep(3 * 1000);
    await changeBG();
  }

  changing = false;
  // eslint-disable-next-line no-script-url
  changeElem.href = 'javascript:changeBG()';
}

(async () => {
  for (;;) {
    await changeBG();
    await sleep(45 * 1000);
  }
})();
