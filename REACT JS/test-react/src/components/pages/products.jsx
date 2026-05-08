import { Fragment, useState } from "react";
import Button from "../Elements/Button/button";
import CardProduct from "../Fragments/CardProduct";

const product = [
  {
    Id: 1,
    title: "Sepatu Baru",
    image: "/images/shoes-1.jpg",
    price: 1000000,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae magnam a ratione enim accusamus praesentium id quibusdam iusto nemo quaerat impedit amet, reprehenderit necessitatibus quod adipisci officiis hic, aspernatur unde.",
  },
  {
    Id: 2,
    title: "Sepatu Lama",
    image: "/images/shoes-1.jpg",
    price: 500000,
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
  {
    Id: 3,
    title: "Sepatu Adidas",
    image: "/images/shoes-1.jpg",
    price: 17500000,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores earum veniam atque ab beatae! Itaque possimus tenetur, laborum voluptatem officiis doloremque similique, atque quaerat, animi corrupti et ad quod fugit.Lorem",
  },
];

const email = localStorage.getItem("email");

const Product = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      qty: 1,
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    window.location.href = "/login";
  };

  const handleAddToCart = (id) => {
    setCart([
      ...cart,
      {
        id,
        qty: 1,
      },
    ]);
  };

  return (
    <Fragment>
      <div className="flex justify-end gap-x-6 h-20 bg-blue-600 text-white items-center px-10">
        {email}
        <Button className="ml-5 bg-black" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="flex justify-center py-5">
        {/* Bagian produk */}
        <div className="w-3/4 flex flex-wrap gap-5">
          {product.map((p) => (
            <CardProduct key={p.Id}>
              <CardProduct.Header images={p.image} />
              <CardProduct.Body title={p.title}>
                {p.description}
              </CardProduct.Body>
              <CardProduct.Footer 
                price={p.price} 
                handleAddToCart={handleAddToCart}
                id={p.Id}   // ✅ pakai p.Id
              />

            </CardProduct>
          ))}
        </div>

        {/* Bagian cart */}
        <div className="w-1/4 px-5">
          <h1 className="text-3xl font-bold text-blue-600">Cart</h1>
          <ul className="mt-4">
            {cart.map((item) => (
              <li key={item.id} className="mb-2"> {/* ✅ pakai item.id */}
                {item.id}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Product;
