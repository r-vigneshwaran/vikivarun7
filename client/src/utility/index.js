export function mapKeyToArray(arr) {
  return arr.map((item, index) => ({
    ...item,
    key: index + 1
  }));
}
