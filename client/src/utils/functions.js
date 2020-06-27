export function withIndex(fn) {
  let index = 0
  let enhancedFunction = function(...args) {
    return fn.call(this, ...args, index++)
  }

  return enhancedFunction
}
