var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    console.log(this)
    console.log(e)
    container.innerHTML = count++;
};

var timeout;

// container.onmousemove = function () {
//     clearTimeout(timeout)
//     timeout = setTimeout(getUserAction, 1000);
// }


function debounce(fun,wait){
    var timeout;
    console.log(this);
    return function (){
        var context = this;
        var arg = arguments;
        clearTimeout(timeout)
        timeout = setTimeout(fun.bind(context,...arg), wait);
    }
}


function throttle(func, wait) {
    var timeout, context, args, result;
    var previous = 0;

    var later = function() {
        previous = +new Date();
        timeout = null;
        func.apply(context, args);
    };

    var throttled = function() {
        var now = +new Date();
        //下次触发 func 剩余的时间
        var remaining = wait - (now - previous);
        console.log("now",now)
        console.log("previous",previous)
        console.log("remaining",remaining)

        context = this;
        args = arguments;
         // 如果没有剩余的时间了或者你改了系统时间
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}




function deb(){
    let b = 1
return function a(fn, delay) {
  if (!b) {
    return
  }
  b = 0
  setTimeout(() => {
    b = 1
    fn()
  }, delay)
}
}


container.onmousemove = throttle(getUserAction,3000)