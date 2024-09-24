const equipmentSlots = document.querySelectorAll('.slot');

import {storeHTML, heroHTML} from "./components.js";

const itemCreateEvent = new Event("item-create");

let playerLvl = 100
let gold = 3000000000;

let uiState = "";

function setUIState(state){
    uiState = state;
}

let baseStats = {
    "Vitality": 0,
    "Agility": 0,
    "Strength": 0,
    "Crit Chance": 0,
    "Crit Damage": 0,
}

const goldDisplay = document.getElementById("goldCount");

function updateStatsDisplay() {
    goldDisplay.innerText = gold;
}

updateStatsDisplay()

const shopTypes = ["weapon", "armor", "magic"];
let currentStoreType = "weapon";

const heroButton = document.getElementById("buttonYourHero");
const weaponStoreButton = document.getElementById("buttonBlacksmith");
const armorStoreButton = document.getElementById("buttonArmorSmith");
const magicStoreButton = document.getElementById("buttonJeweler");

weaponStoreButton.onclick = () => {
    currentStoreType = "weapon";
    setStoreHTML();
    fillStore();
    setUIState("store");
}
armorStoreButton.onclick = () => {
    currentStoreType = "armor";
    setStoreHTML();
    fillStore();
    setUIState("store");
}

magicStoreButton.onclick = () => {
    currentStoreType = "magic";
    setStoreHTML();
    fillStore();
    setUIState("store");
}

heroButton.onclick = () => {
    setHeroHTML();
    displayHeroStats();
    setUIState("stats");
}

function setStoreHTML() {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = storeHTML;
}

function setHeroHTML() {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = heroHTML;
}

function displayHeroStats() {
    setHeroHTML()
    const statsContainer = document.getElementById("playerStatsContainer");

    for (const baseStatName of Object.keys(baseStats)) {
        const statBox = document.createElement("div");
        let statFromEquipment = getTotalStatFromItems(baseStatName);
        statBox.classList.add("stat-box");
        statBox.innerText = baseStatName + ": " + (baseStats[baseStatName] + statFromEquipment) + " (" + statFromEquipment + " from items)";


        const trainButton = document.createElement("button");
        trainButton.innerText = "+";
        trainButton.addEventListener("click", () => {
            if (gold > 10) {
                trainAttribute(baseStatName);
                gold -= 10;
                displayHeroStats();
                updateStatsDisplay();
            }

        })
        statBox.appendChild(trainButton);

        statsContainer.appendChild(statBox);
    }
}

function getTotalStatFromItems(statName) {
    let statAmount = 0;

    const equipmentSlots = document.querySelectorAll(".equipment .item");
    for (const slot of equipmentSlots) {
        const attributes = JSON.parse(slot.getAttribute("data-attributes"));
        let stat = Number(attributes[statName]);
        if (stat > 0) {
            statAmount += stat;
        }
    }

    return statAmount;
}

function trainAttribute(attributeName) {
    baseStats[attributeName] += 127;
}

const attributes = ["Strength", "Vitality", "Crit Chance", "Crit Damage", "Agility"];
const secondaryAttributes = ["Extra Gold", "Extra Experience", "Lower Quest Time"];

const itemNames = {
    weapon: ["Celtic Axe", "Iron Sword", "Steel Sword", "Steel Halberd", "Mace", "Spiked Iron Club", "Macuahuitl"],
    offhand: ["Emerald Knight Shield", "shield"],
    helmet: ["Fortified Helmet", "Visor Helmet", "Plate Helmet"],
    armor: ["Steel Chestplate"],
    belt: ["Amogus"],
    pants: ["Steel Greaves"],
    boots: ["Clown Shoes"],
    ring: ["Blue Stoneplate Ring", "Dark Stoneplate Ring", "Speckled Stoneplate Ring"],
    neck: ["Bronze Ruby Amulet"],

}

function generateItem(type, name) {
    const item = {};

    item.type = type;
    if (name) item.name = name;
    else item.name = itemNames[type][Math.floor(Math.random() * itemNames[type].length)];

    if (item.name === "Macuahuitl") item.name = itemNames[type][Math.floor(Math.random() * itemNames[type].length)];
    item.attributes = {};
    item.secondaryAttributes = {};
    let value = 0;
    let attributeCount = Math.floor(Math.random() * 5 + 1);
    if (item.name === "Macuahuitl") attributeCount = 5;
    value += (attributeCount) ** (attributeCount);
    for (let i = 0; i < attributeCount; i++) {
        let attrKey = attributes[Math.floor(Math.random() * attributes.length)];
        while (item.attributes[attrKey]) attrKey = attributes[Math.floor(Math.random() * attributes.length)];
        let attrValue = Math.floor((Math.random() * 40 + 60) * (playerLvl / 2) ** 2 / 100);
        if (attrValue === 0) attrValue = 3;

        item.attributes[attrKey] = attrValue;
        value += Math.floor(attrValue ** 2 * 0.2);
    }
    if (attributeCount === 1) item.rarity = "Common";
    else if (attributeCount === 2) item.rarity = "Magic";
    else if (attributeCount === 3 || attributeCount === 4) item.rarity = "Enchanted";
    else if (attributeCount === 5) item.rarity = "Ancient";

    if (Math.random() > 0.5) {
        item.secondaryAttributes[secondaryAttributes[Math.floor(Math.random() * secondaryAttributes.length)]] = Math.floor(Math.random() * 20);
    }

    item.value = value;
    return item;
}


const items = [
    generateItem("weapon"),
    generateItem("weapon"),
    generateItem("weapon"),
    generateItem("weapon"),
    generateItem("helmet"),
    generateItem("helmet"),
    generateItem("armor"),
    generateItem("armor"),
    generateItem("belt"),
    generateItem("pants"),
    generateItem("pants"),
    generateItem("offhand"),
    generateItem("offhand"),
    generateItem("ring"),
    generateItem("ring"),
    generateItem("boots"),
    generateItem("neck"),

];


// Function to create an item element
function createItemElement(item) {
    const itemElement = document.createElement('div');

    itemElement.style.display = "flex";

    const image = document.createElement("img");
    const rarityGlow = document.createElement("div");
    rarityGlow.classList.add("rarity-glow");
    image.src = "images/" + item.name.toLowerCase() + ".png"
    image.width = 50;
    image.setAttribute('draggable', 'false');
    itemElement.appendChild(rarityGlow);
    switch (item.rarity) {
        case "Magic":
            rarityGlow.classList.add("rarity-glow-blue");
            break;
        case "Enchanted":
            rarityGlow.classList.add("rarity-glow-yellow");
            break;
        case "Ancient":
            rarityGlow.classList.add("rarity-glow-red");
    }
    itemElement.appendChild(image);
    itemElement.classList.add('item');
    itemElement.setAttribute('draggable', 'true');
    itemElement.setAttribute('data-item-id', item.id);
    itemElement.setAttribute('data-name', item.name);
    itemElement.setAttribute('data-rarity', item.rarity);
    itemElement.setAttribute('data-item-type', item.type);
    itemElement.setAttribute('data-value', item.value);
    itemElement.setAttribute('data-attributes', JSON.stringify(item.attributes));
    itemElement.setAttribute('data-attributes-secondary', JSON.stringify(item.secondaryAttributes));
    return itemElement;
}

// Place the items in the inventory grid
function placeItemInGrid(item, gridCellIndex) {
    const cell = document.querySelectorAll('.grid-cell')[gridCellIndex];
    const itemElement = createItemElement(item);
    cell.appendChild(itemElement);
}

// Add items to the inventory (manually placing for demo)
function placeAllItems() {
    for (let i = 0; i < items.length; i++) {
        placeItemInGrid(items[i], i);
    }
}

placeAllItems();


function fillStore() {

    const storeImage = document.querySelector("#storeImage img");
    let possibleItems = []
    switch (currentStoreType) {
        case "weapon":
            possibleItems = ["weapon", "offhand"];
            storeImage.src = "images/weapon-store.png";
            break;
        case "armor":
            possibleItems = ["armor", "pants", "helmet", "boots"];
            storeImage.src = "images/armor-store.png";
            break;
        case "magic":
            possibleItems = ["ring", "neck"];
            storeImage.src = "images/magic-store.png";
            break;
    }
    const storeItems = [];
    for (let i = 0; i < 24; i++) {
        storeItems[i] = generateItem(possibleItems[Math.floor(Math.random() * possibleItems.length)]);
        placeItemInStore(storeItems[i], i);
    }

}


// Place the items in the inventory grid
function placeItemInStore(item, gridCellIndex) {
    const cell = document.querySelectorAll('.shop-slot')[gridCellIndex];
    cell.innerHTML = ""
    const itemElement = createItemElement(item);
    cell.appendChild(itemElement);
    document.dispatchEvent(itemCreateEvent);
}


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
    if (originCell.classList.contains("shop-slot")) {
        if (gold > draggedItem.getAttribute("data-value")) {
            gold -= draggedItem.getAttribute("data-value")
            console.log("good value")
            updateStatsDisplay();
        } else {
            console.log("Item too expensive!")
            return
        }
    }

    // Handling Grid Cell Drop
    if (dropTarget.classList.contains('grid-cell')) {
        if (!dropTarget.querySelector('.item')) {
            // Move item to new cell
            dropTarget.appendChild(draggedItem);
            if (uiState === "stats") displayHeroStats();
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
        if (uiState === "stats") displayHeroStats();
    }

    // Return item to original cell if drop was invalid
    if (!draggedItem.parentElement) {
        originCell.appendChild(draggedItem);
    }

    draggedItem = null;
    originCell = null;
});

// Get the tooltip element
const tooltip = document.getElementById('tooltip');

// Function to show the tooltip with stats
function showTooltip(event) {
    if (draggedItem) {
        hideTooltip();
        return;
    }
    const item = event.target.parentElement;
    const itemName = item.getAttribute("data-name")
    const stats = [];
    const secondaryStats = [];
    tooltip.innerText = "";
    const itemTitle = document.createElement("h3");
    itemTitle.innerText = itemName
    switch (item.getAttribute("data-rarity")) {
        case "Common":
            itemTitle.style.color = "gray";
            break;
        case "Magic":
            itemTitle.style.color = "blue";
            break;
        case "Enchanted":
            itemTitle.style.color = "yellow";
            break;
        case "Ancient":
            itemTitle.style.color = "red";
            break;
    }

    tooltip.appendChild(itemTitle);

    const attributes = JSON.parse(item.getAttribute("data-attributes"));


    // Gather stats from the data attributes
    for (let i = 0; i < Object.keys(attributes).length; i++) {
        const attrKey = Object.keys(attributes)[i];

        const statName = attrKey
        const statValue = attributes[attrKey];
        stats.push("+ " + statValue + " " + statName);
    }
    // Set the tooltip content and make it visible
    tooltip.innerHTML += '<br>' + stats.join('<br>');

    const secondaryStatsText = document.createElement("h5");
    const secondaryAttributes = JSON.parse(item.getAttribute("data-attributes-secondary"));

    // Gather stats from the data attributes
    for (let i = 0; i < Object.keys(secondaryAttributes).length; i++) {
        const attrKey = Object.keys(secondaryAttributes)[i];

        const statName = attrKey
        const statValue = secondaryAttributes[attrKey];
        secondaryStats.push("+ " + statValue + "% " + statName);
    }


    if (secondaryStats.length > 0) {
        secondaryStatsText.innerHTML = '<br>' + secondaryStats.join('<br>');
        tooltip.appendChild(secondaryStatsText);
    }


    const valueDisplay = document.createElement('div');
    const coinImage = document.createElement('img');
    coinImage.src = "images/coin.png";
    const coinValue = document.createElement('p');
    coinValue.innerText = item.getAttribute("data-value");
    valueDisplay.append(coinValue);
    valueDisplay.append(coinImage);

    valueDisplay.classList.add("tooltip-value")
    tooltip.appendChild(valueDisplay);
    tooltip.style.display = 'block';

    // Position the tooltip near the item
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = event.pageY + 'px';
}

// Function to hide the tooltip
function hideTooltip() {
    tooltip.style.display = 'none';
}

document.addEventListener("item-create", () => {
    // Attach the event listeners to the items
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('mouseover', showTooltip);
        item.addEventListener('mousemove', showTooltip); // For continuous position update
        item.addEventListener('mouseout', hideTooltip);
        item.addEventListener('mousedown', hideTooltip)
    });
})

document.dispatchEvent(itemCreateEvent);

