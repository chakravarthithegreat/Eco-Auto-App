import React from 'react';

// Pinterest-like masonry using CSS columns
// Props: columns (object by breakpoint), gap
// Example: <Masonry columns={{ base: 1, sm: 2, lg: 3 }} gap={16}>{children}</Masonry>
const Masonry = ({ children, columns = { base: 1, sm: 2, lg: 3 }, gap = 16, className = '' }) => {
  const style = {
    columnGap: `${gap}px`,
  };

  // Tailwind-like responsive via inline styles + utility classes
  const columnClasses = [
    `columns-${columns.base || 1}`,
    columns.sm ? `sm:columns-${columns.sm}` : '',
    columns.md ? `md:columns-${columns.md}` : '',
    columns.lg ? `lg:columns-${columns.lg}` : '',
    columns.xl ? `xl:columns-${columns.xl}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${columnClasses} ${className}`} style={style}>
      {React.Children.map(children, (child, idx) => (
        <div key={idx} style={{ breakInside: 'avoid', WebkitColumnBreakInside: 'avoid', paddingBottom: gap }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default Masonry;


