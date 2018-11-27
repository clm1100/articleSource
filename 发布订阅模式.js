function Emitter (ctx) {
  this._ctx = ctx || this
}

var p = Emitter.prototype

p.on = function (event, fn) {
  this._cbs = this._cbs || {}
  ;(this._cbs[event] || (this._cbs[event] = []))
    .push(fn)
  return this
}
// 三种模式 
// 不传参情况清空所有监听函数 
// 仅传事件名则清除该事件的所有监听函数
// 传递事件名和回调函数，则对应仅删除对应的监听事件
p.off = function (event, fn) {
  this._cbs = this._cbs || {}

  // all
  if (!arguments.length) {
    this._cbs = {}
    return this
  }

  // specific event
  var callbacks = this._cbs[event]
  if (!callbacks) return this

  // remove all handlers
  if (arguments.length === 1) {
    delete this._cbs[event]
    return this
  }

  // remove specific handler
  var cb
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i]
    // 这边的代码之所以会有cb.fn === fn要结合once函数去看
    // 给once传递的监听函数其实已经被wrapped过
    // 但是仍然可以通过原来的监听函数去off掉
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1)
      break
    }
  }
  return this
}
// 触发对应事件的所有监听函数，注意最多只能用给监听函数传递三个参数(采用call)
p.emit = function (event, a, b, c) {
  this._cbs = this._cbs || {}
  var callbacks = this._cbs[event]

  if (callbacks) {
    callbacks = callbacks.slice(0)
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].call(this._ctx, a, b, c)
    }
  }

  return this
}
// 触发对应事件的所有监听函数，传递参数个数不受限制(采用apply)
p.applyEmit = function (event) {
  this._cbs = this._cbs || {}
  var callbacks = this._cbs[event], args

  if (callbacks) {
    callbacks = callbacks.slice(0)
    args = callbacks.slice.call(arguments, 1)
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(this._ctx, args)
    }
  }

  return this
}
// 通过调用on与off事件事件，在第一次触发之后就`off`对应的监听事件
p.once = function (event, fn) {
  var self = this
  this._cbs = this._cbs || {}

  function on () {
    self.off(event, on)
    fn.apply(this, arguments)
  }

  on.fn = fn
  this.on(event, on)
  return this
}


let e = new Emitter();
e.on("click",function(){
  console.log(123)
})

e.emit('click');