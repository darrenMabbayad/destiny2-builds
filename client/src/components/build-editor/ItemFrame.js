import React from "react";

function ItemFrame({
  currentItems,
  itemType,
  img,
  toggleItemSearch,
  toggleItemInfo,
}) {
  let hasEquippedItem = false;
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  if (weaponRegex.test(itemType)) {
    hasEquippedItem = currentItems.weapons[itemType].itemHash ? true : false;
  } else if (armorRegex.test(itemType)) {
    hasEquippedItem = currentItems.armor[itemType].itemHash ? true : false;
  }
  return (
    <div className="item-frame-container">
      <div className="item-frame">
        <img
          className="item-frame-img"
          id={itemType}
          src={img}
          alt=""
          onClick={e => toggleItemSearch(e)}
        />
      </div>
      {hasEquippedItem && (
        <button
          id={itemType}
          className="item-frame-btn"
          onClick={e => toggleItemInfo(e)}
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default ItemFrame;
