/**
 * @description recieves a number argument to yield a offset and limit values
 * @param {Number} page_no query params
 * @return {Object} { startIndex, endIndex }
 */

const listRange = (
  page_no: number
): { startIndex: number; endIndex: number } => {
  const page = Number(page_no);
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    startIndex,
    endIndex,
  };
};

export default listRange;
