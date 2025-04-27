import React from "react";

const QuickButtons = ({ setSingleItem, quantityItems, itemPrices }) => {
  const updateQuantiy = (e) => {
    e.preventDefault();
    setSingleItem((prevSingleItem) => ({
      ...prevSingleItem,
      soldQty: Number(e.target.value),
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
        <div className="btn btn-sm btn-outline btn-warning " key="Quantities">
          Quantities
        </div>
        {quantityItems.map((quantityItem) => (
          <button
            className="btn btn-sm btn-outline "
            value={quantityItem}
            onClick={(e) => updateQuantiy(e)}
            key={quantityItem}
          >
            {quantityItem}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap my-2 gap-2">
        <button className="btn btn-sm btn-outline btn-info " key="Prices">
          Prices
        </button>
        {itemPrices.map((itemPrice) => (
          <button
            className="btn btn-sm  btn-outline"
            value={itemPrice}
            onClick={(e) => updatePrice(e)}
            key={itemPrice}
          >
            {itemPrice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickButtons;
