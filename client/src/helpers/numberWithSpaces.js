const numberWithSpaces = (x = 0) => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
};

export default numberWithSpaces;
