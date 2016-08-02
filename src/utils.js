
export function distance(v1, v2) {
  // euclidean distance between two vectors
  let sum = 0;
  sum += Math.pow(v1.x - v2.x, 2);
  sum += Math.pow(v1.y - v2.y, 2);
  return Math.sqrt(sum);
}

export function equals(objA, objB) {

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  let bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}


