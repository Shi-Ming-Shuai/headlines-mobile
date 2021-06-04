// 防抖  在规定时间内 多次触发   只执行一次函数
export function debounce(fun, delay = 500) {
  let timer = null // 用来记录定时器, 嵌套函数中引用类timer 形成了闭包 timer不销毁
  return function (...arg) {
    // console.log(arg)
    timer && clearTimeout(timer) // 如果定时器存在 清除定时器 重新计时
    timer = setTimeout(() => {
      fun.apply(this, arg) // 调用函数的时候传递过来的参数 给fun使用
    }, delay)
  }
}

// 节流   连续触发事件 但是在n秒内 只执行一次函数
export function throttle(fun, delay = 3000) {
  let flag = true // 节流阀 为true 表示开启 可以执行函数
  return function (...arg) {
    // console.log(arg)
    // 判断节流阀 状态 如果是关闭 则不执行函数
    if (!flag) {
      return
    }
    // 立即关闭节流阀
    flag = false
    // 节流阀开启状态  规定时间内执行函数
    setTimeout(() => {
      fun.apply(this, arg) // 调用函数的时候传递过来的参数 给fun使用
      // 函数运行完开启节流阀
      flag = true
    }, delay)
  }
}
