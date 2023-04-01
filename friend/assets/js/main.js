/* global fetchBG */

console.log(
  '\n %c Made with love %c by AyagawaSeirin | owomoe.net ',
  'color:#444;background:#eee;padding:5px 0;',
  'color:#F8F8FF;background:#F4A7B9;padding:5px 0;'
);

async function retry(func, times = 3, ...args) {
  for (let i = 0; i < times; i += 1) {
    try {
      await func(...args);
    } catch (e) {
      console.log(e);
      continue;
    }
    break;
  }
}

async function setBG() {
  const [info, bgBlob] = await fetchBG();

  const bgUrl = URL.createObjectURL(bgBlob);
  const htmlElem = document.getElementById('rin-bg');
  htmlElem.style.backgroundImage = `url("${bgUrl}")`;

  const bgInfoObj = document.getElementById('bg-link');
  bgInfoObj.href = `https://www.pixiv.net/artworks/${info.pid}`;
}

async function setHitoKoto() {
  const ret = await fetch('https://v1.hitokoto.cn?encode=text');
  const hitokoto = await ret.text();
  const hitoElem = document.getElementById('hitokoto');
  hitoElem.innerText = hitokoto;
}

retry(setBG);
retry(setHitoKoto);
