const pify = require('pify');

class RequestDecorator {
  constructor ({
    maxLimit = 5,
    requestApi,
    needChange2Promise,
  }) {
    this.maxLimit = maxLimit;
    this.requestQueue = [];
    this.currentConcurrent = 0;
    this.requestApi = needChange2Promise ? pify(requestApi) : requestApi;
  }
  async request(...args) {
    if (this.currentConcurrent >= this.maxLimit) {
      await this.startBlocking();
    }

    this.currentConcurrent++;
    const result = await this.requestApi(...args);
    console.log('当前并发数:', this.currentConcurrent);
    this.currentConcurrent--;
    this.next();
    return Promise.resolve(result);
  }
  startBlocking() {
    let _resolve;
    let promise2 = new Promise((resolve, reject) => _resolve = resolve);
    this.requestQueue.push(_resolve);
    return promise2;
  }
  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    _resolve();
  }
}


function delay(num, time, cb) {
  setTimeout(() => {
    cb(null, num);
  }, time);
}

// 通过maxLimit设置并发量限制，needChange2Promise将callback类型的请求api转化为promise类型的。
const requestInstance = new RequestDecorator({
  maxLimit: 5,
  requestApi: delay,
  needChange2Promise: true,
});




let promises = [];
for (let i = 0; i < 30; i++) {
  // 接下来你就可以像原来使用你的api那样使用它,参数和原来的是一样的
  promises.push(
    requestInstance.request(i, Math.random() * 3000)
    );
}



async function test() {
  await Promise.all(promises).then(function(results){
    console.log(results)
  });
}

test();