const weaponRegex = /(kinetic)|(special)|(power)/;
const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

export default function checkArmorSlot(itemToChange, replacementItem) {
  if (
    (weaponRegex.test(itemToChange) && replacementItem.itemType !== 3) ||
    (armorRegex.test(itemToChange) && replacementItem.itemType !== 2)
  ) {
    return "That's an armor slot, boss";
  } else if (
    itemToChange === "helmet" &&
    replacementItem.equippingBlock.equipmentSlotTypeHash !== 3448274439
  ) {
    return "That's a helmet slot, boss";
  } else if (
    itemToChange === "gloves" &&
    replacementItem.equippingBlock.equipmentSlotTypeHash !== 3551918588
  ) {
    return "That's a gloves slot, boss";
  } else if (
    itemToChange === "chest" &&
    replacementItem.equippingBlock.equipmentSlotTypeHash !== 14239492
  ) {
    return "That's a chest armor slot, boss";
  } else if (
    itemToChange === "boots" &&
    replacementItem.equippingBlock.equipmentSlotTypeHash !== 20886954
  ) {
    return "That's a boots slot, boss";
  } else if (
    itemToChange === "classItem" &&
    replacementItem.equippingBlock.equipmentSlotTypeHash !== 1585787867
  ) {
    return "That's a class item slot, boss";
  }
}
