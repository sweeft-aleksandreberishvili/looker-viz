export const CustomCell = (props) => {
  const { value, eGridCell } = props;
  eGridCell.style.backgroundColor = `rgba(255, 0, 0, ${+value + 0.05})`;
  return value;
};
