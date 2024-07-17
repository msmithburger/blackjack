export const pipe = <T>(x: T, ...fns: Array<(x: T) => T>): T =>
  fns.reduce((v, f) => f(v), x);
