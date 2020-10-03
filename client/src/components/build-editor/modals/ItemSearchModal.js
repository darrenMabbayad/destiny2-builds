import React, { useState, useContext } from "react";
import { DestinyContext } from "../../../context/DestinyContext";
import FormInput from "../FormInput";
import checkArmorSlot from "../../../utils/checkArmorSlot";
import checkWeaponSlot from "../../../utils/checkWeaponSlot";

function ItemSearchModal({
  toggleItemSearch,
  itemToSearch,
  handleChange,
  searchItem,
  itemToChange,
  changeItem,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const { manifest } = useContext(DestinyContext);
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

  async function searchItemAndRenderList(e, query) {
    e.preventDefault();
    let res = await searchItem(query);
    const items = res.Response.results.results.map(
      result => manifest.DestinyInventoryItemDefinition[result.hash]
    );
    const filteredItems = items.filter(item =>
      item.hasOwnProperty("collectibleHash")
    );
    setSearchResults(filteredItems);
  }

  function closeModal(e) {
    toggleItemSearch(e);
    setSearchResults([]);
  }

  function changeItemAndCloseModal(e, item) {
    let error = "";
    if (weaponRegex.test(itemToChange)) {
      error = checkWeaponSlot(itemToChange, item);
    } else if (armorRegex.test(itemToChange)) {
      error = checkArmorSlot(itemToChange, item);
    }

    if (!error) {
      const selectedItem = {
        name: item.displayProperties.name,
        icon: `http://www.bungie.net/${item.displayProperties.icon}`,
        itemHash: item.hash,
        perks: [],
        mod: { name: "", description: "", icon: "" },
        masterwork: { name: "", description: "", icon: "" },
      };
      changeItem(e, selectedItem, itemToChange);
      closeModal(e);
    }
  }

  return (
    <>
      <div className="item-search-overlay" onClick={e => closeModal(e)} />
      <div className="item-search-modal">
        <form onSubmit={e => searchItemAndRenderList(e, itemToSearch)}>
          <FormInput
            label="Item Finder"
            name="search-query"
            value={itemToSearch}
            placeholder="Search an item"
            handleChange={handleChange}
          />
        </form>
        <button onClick={e => searchItemAndRenderList(e, itemToSearch)}>
          Search
        </button>
        {searchResults && (
          <div className="item-search-results">
            {searchResults.map((item, index) => (
              <div key={index} className="item-frame search-result">
                <img
                  className="item-frame-img"
                  src={`http://www.bungie.net/${item.displayProperties.icon}`}
                  alt=""
                  onClick={e => changeItemAndCloseModal(e, item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ItemSearchModal;
