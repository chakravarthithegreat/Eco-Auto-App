import React from 'react';

const getRowClass = (cols) => {
  switch (cols) {
    case 1:
      return 'grid grid-cols-1 gap-4';
    case 2:
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    case 3:
      return 'grid grid-cols-1 md:grid-cols-3 gap-4';
    case 4:
      return 'grid grid-cols-1 md:grid-cols-4 gap-4';
    default:
      return 'grid grid-cols-1 md:grid-cols-3 gap-4';
  }
};

// PatternGrid arranges items into rows following a pattern like [1,3,2,3]
const PatternGrid = ({ items = [], pattern = [1, 3, 2, 3], className = '' }) => {
  const rows = [];
  let index = 0;
  let pIndex = 0;

  while (index < items.length) {
    const cols = pattern[pIndex % pattern.length] || 1;
    const rowItems = items.slice(index, index + cols);
    rows.push({ cols, rowItems });
    index += rowItems.length;
    pIndex += 1;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {rows.map((row, i) => (
        <div key={i} className={getRowClass(row.cols)}>
          {row.rowItems.map((child, j) => (
            <div key={j} className="min-w-0">{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PatternGrid;


