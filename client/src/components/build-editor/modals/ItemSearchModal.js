import React, { useState, useContext } from "react";
import { DestinyContext } from "../../../context/DestinyContext";
import FormInput from "../FormInput";
import QuickDetailsModal from "./QuickDetailsModal";

function ItemSearchModal({
  toggleItemSearch,
  itemToSearch,
  handleChange,
  itemToChange,
  changeItem,
  toggleQuickDetails
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [quickHoverDetails, setQuickHoverDetails] = useState({})
  const [showQuickDetails, setShowQuickDetails] = useState(false)
  const [infoType, setInfoType] = useState('')
  const { manifest, searchResults: preparedList } = useContext(DestinyContext);
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  const filterRegex = /\w+:\w+/
  
  function checkFilterString(string) {
    let filterString = ''
    const sourceRegex = /(source):\w+/i // check for source:word
    const isRegex = /(is):\w+/i // check for is:word
    if(sourceRegex.test(string)) {
      filterString = string.replace(/^(.*?):*$/, '$1').split(':')
      filterString.shift()
      filterString = filterString.join('')
      filterItemsBySource(filterString)
    } else if(isRegex.test(string) && weaponRegex.test(itemToChange)) {
      filterString = string.replace(/^(.*?):*$/, '$1').split(':')
      filterString.shift()
      filterString = filterString.join('')
      filterWeaponsByType(filterString)
    } else return false
  }

  function searchItemFromPreparedList(e, query) {
    e.preventDefault();
    if (filterRegex.test(query)) {
      checkFilterString(query)
      return 
    }
    let queryRegex = new RegExp(query, "i");
    let result = [];
    for(const property in preparedList) {
      for(const element of preparedList[property]) {
        if (queryRegex.test(element.displayProperties.name)) {
          result.push(element);
        }
      }
    }
    setSearchResults(result);
  }

  function filterItemsBySource(filter) {
      const filterString = filter
      const itemList = new Set()
      for(const key in manifest.collectibles) {
        if(manifest.collectibles[key].sourceString) {
          if(manifest.collectibles[key].sourceString.toLowerCase().includes(filterString)) {
            itemList.add(manifest.collectibles[key].displayProperties.name)
          }
        }
      }
      let result = []
      for(const property in preparedList) {
        for(const element of preparedList[property]) {
          if (itemList.has(element.displayProperties.name)) {
            result.push(element)
          }
        }
      }
      setSearchResults(result)
  }

  function filterWeaponsByType(filter) {
    const filterString = filter
    if (filterString.toLowerCase().includes('scout')) {
      setSearchResults(preparedList['scoutRifle'])
    } else if (filterString.toLowerCase().includes('auto')) {
      setSearchResults(preparedList['autoRifle'])
    } else if (filterString.toLowerCase().includes('pulse')) {
      setSearchResults(preparedList['pulseRifle'])
    } else if (filterString.toLowerCase().includes('fusion')) {
      setSearchResults(preparedList['fusionRifle'])
    } else if (filterString.toLowerCase().includes('linear')) {
      setSearchResults(preparedList['linearFusionRifles'])
    } else if (filterString.toLowerCase().includes('sniper')) {
      setSearchResults(preparedList['sniperRifle'])
    } else if (filterString.toLowerCase().includes('hand cannon')) {
      setSearchResults(preparedList['handCannon'])
    } else if (filterString.toLowerCase().includes('shotgun')) {
      setSearchResults(preparedList['shotgun'])
    } else if (filterString.toLowerCase().includes('sidearm')) {
      setSearchResults(preparedList['sidearm'])
    } else if (filterString.toLowerCase().includes('machine gun')) {
      setSearchResults(preparedList['machineGun'])
    } else if (filterString.toLowerCase().includes('rocket')) {
      setSearchResults(preparedList['rocketLauncher']) 
    } else if (filterString.toLowerCase().includes('grenade')) {
      setSearchResults(preparedList['grenadeLaunchers'])
    } else if (filterString.toLowerCase().includes('sword')) {
      setSearchResults(preparedList['sword'])
    } else if (filterString.toLowerCase().includes('smg')) {
      setSearchResults(preparedList['submachineGuns'])
    } else if (filterString.toLowerCase().includes('trace')) {
      setSearchResults(preparedList['traceRifles'])
    } else if (filterString.toLowerCase().includes('bow')) {
      setSearchResults(preparedList['bows'])
    }
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

  function openQuickDetails(itemInfo, type) {
    setInfoType(type)
    setQuickHoverDetails(itemInfo)
    setShowQuickDetails(true)
  }

  function closeQuickDetails() {
    setShowQuickDetails(false)
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
                  onMouseEnter={e => openQuickDetails(item, 'itemSearch')}
                  onMouseLeave={() => closeQuickDetails()}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {showQuickDetails && <QuickDetailsModal details={quickHoverDetails} infoType={infoType}/>}
    </>
  );
}

export default ItemSearchModal;
