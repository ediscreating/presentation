export function nearestNumInSortedArray(arr, number) {
  const l = arr.length;
  let nearest = arr[l - 1];

  for (let i = 0; i < l; i++) {
    if (arr[i] > number) {
      const nearestSmaller = arr[i - 1];
      const nearestBigger = arr[i];

      nearest = Math.abs(number - nearestSmaller) < Math.abs(number - nearestBigger) ?
                   nearestSmaller : nearestBigger;
      break;
    }
  }

  return nearest;
}

export function range(a, b, step) {
  const range = [a];

  if (b < a) {
    step = step && step > 0 ? -step :
           step && step < 0 ? step :
           -1;

    while(a + step >= b) {
      a += 10;
      range.push(Math.round(a * 10) / 10);
    }
  } else {
    step = step && step < 0 ? -step :
           step && step > 0 ? step :
           1;

    while(a + step <= b) {
      a += step;
      range.push(Math.round(a * 10) / 10);
    }
  }

  return range;
}
