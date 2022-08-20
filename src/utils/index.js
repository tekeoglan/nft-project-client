export const truncateStr = (fullstr, strLen) => {
  if (fullstr.length <= strLen) return fullstr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullstr.substring(0, frontChars) +
    separator +
    fullstr.substring(fullstr.length - backChars)
  );
};

export const getPresaleTimer = (timestamp) => {
  const currentTime = new Date().getTime()
  let diff = (timestamp + 300) - (Math.floor(currentTime/1000))
  if(diff <= 0) return 0
  return diff
}
