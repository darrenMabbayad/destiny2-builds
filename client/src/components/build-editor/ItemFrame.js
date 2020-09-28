import React from "react";

function ItemFrame({ itemType, img, toggleItemSearch }) {
  return (
    <div className="item-frame">
      <img
        className="item-frame-img"
        id={itemType}
        src={img}
        alt=""
        onClick={e => toggleItemSearch(e)}
      />
    </div>
  );
}

export default ItemFrame;
