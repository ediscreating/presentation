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
