import React from 'react';
import '../styles.css';

const Button = ({ children, variant = 'primary', ...props ,classAraay=[] }) => {
    const combinedClasses = ['btn', variant, ...classArray].join(' ');
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;