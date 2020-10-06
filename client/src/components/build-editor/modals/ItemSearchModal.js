import React, { useState, useContext } from "react";
import { DestinyContext } from "../../../context/DestinyContext";
import FormInput from "../FormInput";

function ItemSearchModal({
  toggleItemSearch,
  itemToSearch,
  handleChange,
  itemToChange,
  changeItem,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const { searchResults: preparedList } = useContext(DestinyContext);
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

  function searchItemFromPreparedList(e, query) {
    e.preventDefault();
    let queryRegex = new RegExp(query, "i");
    let result = [];
    for (const property in preparedList) {
      for (const element of preparedList[property]) {
        if (queryRegex.test(element.displayProperties.name)) {
          result.push(element);
        }
      }
    }
    setSearchResults(result);
  }

  function closeModal(e) {
    toggleItemSearch(e);
    setSearchResults([]);
  }

  function changeItemAndCloseModal(e, item) {
    let selectedItem = {};
    if (weaponRegex.test(itemToChange)) {
      selectedItem = {
        name: item.displayProperties.name,
        icon: `http://www.bungie.net/${item.displayProperties.icon}`,
        itemHash: item.hash,
        perks: [],
        mod: { name: "", description: "", icon: "" },
        masterwork: { name: "", description: "", icon: "" },
      };
    } else if (armorRegex.test(itemToChange)) {
      selectedItem = {
        name: item.displayProperties.name,
        icon: `http://www.bungie.net/${item.displayProperties.icon}`,
        itemHash: item.hash,
        mods: [],
        energyType: "",
      };
    }
    changeItem(e, selectedItem, itemToChange);
    closeModal(e);
  }

  return (
    <>
      <div className="item-search-overlay" onClick={e => closeModal(e)} />
      <div className="item-search-modal">
        <form onSubmit={e => searchItemFromPreparedList(e, itemToSearch)}>
          <FormInput
            label="Item Finder"
            name="search-query"
            value={itemToSearch}
            placeholder="Search an item"
            handleChange={handleChange}
          />
        </form>
        <button onClick={e => searchItemFromPreparedList(e, itemToSearch)}>
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
