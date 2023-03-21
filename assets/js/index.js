/* global axios */

async function changeBG() {
  // 原api没法过cors 我用cf workers反代了
  const res = (
    await axios.get('https://fuck-cors.lgc2333.top/setu/v2', {
      params: {
        num: 10,
        proxy: 'fuck-cors.lgc2333.top',
        tag: '萝莉|少女',
      },
      headers: {
        upstream_url: 'api.lolicon.app',
      },
    })
  ).data;

  let { data } = res;
  if (data) {
    // 屏幕比例小于3：4用竖屏图，否则横屏
    // 如果没有筛选到指定尺寸的图，那么直接用返回的第一个图
    const { innerWidth, innerHeight } = window;
    const isPortrait = innerWidth / innerHeight <= 3 / 4;
    const filteredData = data.filter((v) => {
      // 顺便过滤AI图
      if (v.aiType === 2) return false;

      const { width, height } = v;
      let result = width >= height; // 是否横屏
      if (isPortrait) result = !result;
      return result;
    });
    if (filteredData.length > 0) data = filteredData;
    const selectedPic = data[0];
    const picUrl = selectedPic.urls.original;
    // console.log(picUrl);

    // 拿图
    const picRes = await axios.get(picUrl, {
      responseType: 'blob',
      headers: {
        upstream_url: 'i.pixiv.re',
      },
    });
    const imgType = picRes.headers['content-type'];
    if (!imgType.includes('image'))
      throw new TypeError(`返回数据类型不对 (${imgType})`);

    const b64Res = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onabort = reject;
      reader.readAsDataURL(picRes.data);
      reader.onloadend = (e) => {
        resolve(e.target.result);
      };
    });

    // 动画
    const bgElement = document.getElementById('bg');
    bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;
    await new Promise((resolve) => {
      bgElement.addEventListener('animationend', resolve);
    });
    bgElement.style.backgroundImage = `url("${b64Res}")`;
    bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

    // 图片信息
    const bgInfoA = document.getElementById('bg-info');
    bgInfoA.innerText = selectedPic.title;
    bgInfoA.href = `https://www.pixiv.net/artworks/${selectedPic.pid}`;
  } else {
    throw new Error(`获取图片失败，res=${JSON.stringify(res)}`);
  }
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

(async () => {
  for (;;) {
    try {
      await changeBG();
    } catch (e) {
      console.error(e);
      await sleep(3 * 1000);
      continue;
    }
    await sleep(45 * 1000);
  }
})();
