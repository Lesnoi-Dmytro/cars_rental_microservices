export function stringToArray(value: string): string[] {
  return value.split(',');
}

export function arrayToString(value: string[]): string {
  return value.join(',');
}
