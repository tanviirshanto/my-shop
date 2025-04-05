import React from 'react'

const QuickPriceButton = ({setSingleItem, itemPrices}) => {
    const updateQuantiy = (e) => {
        e.preventDefault();
        setSingleItem((prev) => ({
            ...prev,
            product: { ...prev.product, price: Number(e.target.value) },
          }));
      };
    
      return (
        <div className="flex flex-wrap my-2 gap-2">
            { itemPrices.map((itemPrice) =><button
            className="btn btn-sm btn-outline"
            value={itemPrice}
            onClick={(e) => updateQuantiy(e)}
            key={itemPrice}
          >
            {itemPrice}
          </button>)}
       
        </div>
      );
}

export default QuickPriceButton