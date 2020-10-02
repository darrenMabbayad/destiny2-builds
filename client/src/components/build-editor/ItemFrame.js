import React from "react";

function ItemFrame({ itemType, img, toggleItemSearch, toggleItemInfo }) {
  return (
    <div className="item-frame">
      <img
        className="item-frame-img"
        id={itemType}
        src={img}
        alt=""
        onClick={e => toggleItemSearch(e)}
        onMouseEnter={e => toggleItemInfo(e)}
        // onMouseLeave={e => toggleItemInfo(e)}
      />
    </div>
  );
}

export default ItemFrame;
