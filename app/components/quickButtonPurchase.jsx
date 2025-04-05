import React from "react";

const QuickButtonPurchase = ({ setSingleItem ,quantityItems, productPrices}) => {
  const updateQuantiy = (e) => {
    e.preventDefault();
    setSingleItem((prevSingleItem) => ({
      ...prevSingleItem,
      boughtQty: Number(e.target.value),
    }));
  };

  const updatePrice = (e) => {
    e.preventDefault();
    setSingleItem((prev) => ({
      ...prev,
      product: { ...prev.product, price: Number(e.target.value) },
    }));
  };

  return (
    <div className=" flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
      <div
        className="btn btn-sm btn-outline "
        key="Quantities"
      >
        Quantities
      </div>
      {quantityItems.map((quantityItem) => (<button
        className="btn btn-sm btn-outline btn-warning"
        value={quantityItem}
        onClick={(e) => updateQuantiy(e)}
        key={quantityItem}
      >
        {quantityItem}
      </button>))}

    </div>
    <div className="flex flex-wrap gap-2">
    <button
        className="btn btn-sm btn-outline"
        key="Prices"
      >
        Prices
      </button>
      {productPrices.map((productPrice) => (<button
        className="btn btn-sm btn-info"
        value={productPrice}
        onClick={(e) => updatePrice(e)}
        key={productPrice}
      >
        {productPrice}
      </button>))}

    </div>
    </div>
    
  );
};

export default QuickButtonPurchase;
