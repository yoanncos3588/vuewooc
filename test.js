const data = [
  { id: 1, parent: 0, test: 2 /* other properties */ },
  { id: 2, parent: 1, test: 3 /* other properties */ },
  { id: 3, parent: 1, test: 4 /* other properties */ },
  // ... more objects
];

// Step 1: Create a mapping of IDs to objects
const idToObjectMap = {};
data.forEach((item) => {
  idToObjectMap[item.id] = item;
});

// Step 2: Update the isParent property based on the parent property
data.forEach((item) => {
  item.test += 1;
  if (item.parent !== 0) {
    const parentObject = idToObjectMap[item.parent];
    parentObject ? (parentObject.isParent = true) : (parentObject.isParent = false);
  } else {
    item.isParent = false;
  }
});

console.log(data);
console.log(idToObjectMap);
