export const isUndef = (v) =>
  v === null || v === undefined || v === "" || Number.isNaN(v);

export const isValidNumber = (v) => {
  if (isUndef(v)) return false;
  return !isNaN(Number(v));
};
