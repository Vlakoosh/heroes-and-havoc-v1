// script.js

// Constants for the inventory
const inventoryGrid = document.getElementById('inventory-grid');
const equipmentSlots = document.querySelectorAll('.slot');

// Create an empty inventory grid (5x5 = 25 cells)
for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    inventoryGrid.appendChild(cell);
}

// Sample items, with various sizes (width x height)
const items = [
    { id: 1, name: 'Sword', type: 'weapon', width: 1, height: 2 },
    { id: 2, name: 'Helmet', type: 'helmet', width: 2, height: 2 },
    { id: 3, name: 'Armor', type: 'armor', width: 2, height: 2 },
    { id: 4, name: 'Shield', type: 'shield', width: 1, height: 2 }
];

// Function to create an item element
function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.setAttribute('draggable', 'true');
    itemElement.setAttribute('data-item-id', item.id);
    itemElement.setAttribute('data-item-type', item.type);
    itemElement.setAttribute('data-size', `${item.width}x${item.height}`);
    itemElement.style.gridRowEnd = `span ${item.height}`;
    itemElement.style.gridColumnEnd = `span ${item.width}`;
    itemElement.innerText = item.name;
    return itemElement;
}

// Place the items in the inventory grid
function placeItemInGrid(item, gridCellIndex) {
    const cell = document.querySelectorAll('.grid-cell')[gridCellIndex];
    const itemElement = createItemElement(item);
    cell.appendChild(itemElement);
}

// Add items to the inventory (manually placing for demo)
placeItemInGrid(items[0], 0);  // Sword
placeItemInGrid(items[1], 6);  // Helmet
placeItemInGrid(items[2], 12); // Armor
placeItemInGrid(items[3], 18); // Shield

// Drag-and-Drop Handlers
let draggedItem = null;
let originCell = null;

// Drag start event
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('item')) {
        draggedItem = e.target;
        originCell = draggedItem.parentElement;
        e.target.classList.add('dragging');
    }
});

// Drag end event
document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('item')) {
        e.target.classList.remove('dragging');
    }
});

// Handle when an item is dragged over a grid cell or equipment slot
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// Handle dropping an item into a grid cell or equipment slot
document.addEventListener('drop', (e) => {
    const dropTarget = e.target;

    // Handling Grid Cell Drop
    if (dropTarget.classList.contains('grid-cell')) {
        if (!dropTarget.querySelector('.item')) {
            // Move item to new cell
            dropTarget.appendChild(draggedItem);
        }
    }

    // Handling Equipment Slot Drop
    else if (dropTarget.classList.contains('slot')) {
        const slotType = dropTarget.getAttribute('data-slot-type');
        const itemType = draggedItem.getAttribute('data-item-type');

        if (slotType === itemType && !dropTarget.querySelector('.item')) {
            // Move item to equipment slot
            dropTarget.appendChild(draggedItem);
        } else {
            console.log('Item type does not match the slot type.');
        }
    }

    // Return item to original cell if drop was invalid
    if (!draggedItem.parentElement) {
        originCell.appendChild(draggedItem);
    }

    draggedItem = null;
    originCell = null;
});
