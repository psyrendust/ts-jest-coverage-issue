/**
 * Create a safe performance.now() implementation that is safe for Node and the Browser.
 */
const perfNow = ((win) => {
  let perf;
  if (typeof win !== undefined && win.performance !== undefined ) {
    perf = win.performance;
  } else {
    perf = Date;
  }
  return function perfNow() {
    return perf.now();
  };
})(window);

export default perfNow;
