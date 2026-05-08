import React from 'react';

const Button = (props) => {
  const {children = "...", variant = "bg-black", type="button", onClick =  () => {}} = props
  return (
    <button 
      type={type}
      className={`h-10 px-6 font-semibold rounded-md ${variant} text-white hover:bg-gray-800`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
