
export function findWithRegex(regex, text) {
  let matches, start;
  let results = [];
  while ((matches = regex.exec(text)) !== null) {
    start = matches.index;
    results.push({start, end: start + matches[0].length, matches});
  }
  return results;
}
