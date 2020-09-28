import React, { useState } from "react";
import FormInput from "../FormInput";

function ItemSearchModal({
  toggleItemSearch,
  itemToSearch,
  handleChange,
  searchItem,
  itemToChange,
  changeItem,
}) {
  const [searchResults, setSearchResults] = useState([]);

  async function searchItemAndRenderList(query) {
    let res = await searchItem(query);
    setSearchResults(res.Response.results.results);
  }

  function closeModal(e) {
    toggleItemSearch(e);
    setSearchResults([]);
  }

  function changeItemAndCloseModal(e, item) {
    const selectedItem = {
      name: item.displayProperties.name,
      icon: `http://www.bungie.net/${item.displayProperties.icon}`,
    };
    changeItem(e, selectedItem, itemToChange);
    closeModal(e);
  }

  return (
    <>
      <div className="item-search-overlay" onClick={e => closeModal(e)} />
      <div className="item-search-modal">
        <FormInput
          label="Item Finder"
          name="search-query"
          value={itemToSearch}
          placeholder="Search an item"
          handleChange={handleChange}
        />
        <button onClick={() => searchItemAndRenderList(itemToSearch)}>
          Search
        </button>
        <div>
          {searchResults &&
            searchResults.map((item, index) => (
              <div key={index} className="item-frame">
                <img
                  className="item-frame-img"
                  src={`http://www.bungie.net/${item.displayProperties.icon}`}
                  alt=""
                  onClick={e => changeItemAndCloseModal(e, item)}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ItemSearchModal;
