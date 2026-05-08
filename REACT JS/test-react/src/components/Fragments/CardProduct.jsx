import Button from "../Elements/Button/button";

const CardProcuct = (props) => {
    const{children} = props
    return(
            <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow mx-2 my-2 flex flex-col justify-between">
                {children}
            </div>
    )
}

const Header = (props) => {
    const{images} = props
    return(
        <a href="">
            <img 
                src={images}
                alt="product" 
                className="p-8 rounded-t-lg" />
        </a>
    )
}

const Body = (props) => {
    const {children,title} = props
    return(
        <div className="px-5 pb-5 h-full">
                <a href="">
                <h5 className="text-xl font-semibold tracking-light text-white">
                    {title}
                </h5>
                <p className="text-m text-white">
                    {children}
                </p>
            </a>
        </div>
    )
}

const Footer = (props) => {
  const { price, handleAddToCart, id } = props;
  return (
    <div className="flex items-center justify-between px-5 pb-5">
      <span className="text-xl font-bold text-white">
        {price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })} {/* ✅ style bukan styles */}
      </span>
      <Button 
        variant="bg-blue-600" 
        onClick={() => handleAddToCart(id)}  // ✅ id dikirim ke parent
      >
        Add to Cart
      </Button>
    </div>
  );
};

CardProcuct.Header = Header
CardProcuct.Body = Body
CardProcuct.Footer = Footer

export default CardProcuct;