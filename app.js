const grid = document.querySelector("#grid");

/**
 * Populates a node with 12 cards and 
 * appends a img with src to the cards
 * @param {HTMLElement} gridNode
 */
const populateWithCards = (gridNode) => {
  for (let i = 1; i <= 12; i++) {
    const card = document.createElement("div");
    const img = document.createElement("img");
    img.src = `assets/backside.png`;
    img.classList.add("card-image");
    card.setAttribute("data-match", "false");
    card.setAttribute("data-open", "false");
    card.id = `card${i}`;
    card.classList.add("card");
    card.appendChild(img);
    gridNode.appendChild(card);
  }
};

/**
 * Disables click events on all elements of a HTMLCollection
 * @param {HTMLCollection} cards
 */
const disableAllCards = (cards) => {
  cards.forEach((card) => {
    card.style.pointerEvents = "none";
  });
};
/**
 * Enables click events on all elements of a HTMLCollection
 * @param {HTMLCollection} cards
 */
const enableAllCards = (cards) => {
  cards.forEach((card) => {
    card.style.pointerEvents = "auto";
  });
};

/**
 * Opens up a card by changing it's source and dataset
 * @param {*} cardNode the card with a img Node inside
 * @param {*} map a map with the card id as key and the source for the image as value
 */
const showCard = (cardNode, map) => {
  cardNode.children[0].src = map.get(cardNode.id);
  cardNode.dataset.open = "true";
};
/**
 * Closes a card by changing its source and dataset
 * @param {*} cardNode the card with a img Node inside
 */
const hideCard = (cardNode) => {
  cardNode.children[0].src = "assets/backside.png";
  cardNode.dataset.open = "false";
};

/**
 * Compares 2 cards by comparing the 
 * sources of the images inside
 * @param {*} cardNode 2st card
 * @param {*} cardBuffer 1st card
 * @return {boolean}  
 */
const compareCards = (cardNode, cardBuffer) => {
  if (cardNode.children[0].src === cardBuffer[1]) {
    return true;
  }
  return false;
};

/**
 *Shuffles an array
 * @param {[]} array to shuffle
 * @return {[]} Shuffled array
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i != 0; i--) {
    let randomIndex = Math.floor(Math.random() * i);
    let temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

/**
 * Returns a map with keys as array1 values
 * and values as array2 values
 * Both arrays should be the same length
 * @param {*} array1 keys
 * @param {*} array2 values
 * @return {Map} Map
 */
const mapFromArrays = (keys, values) => {
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }
  return map;
};

/**
 * Creates an array with the leength of 12
 * Inside are 6 different image sources 
 * each source is duplicated
 * The array is shuffled
 * @return {array} Shuffled array  
 */
const createArrayOfRandomSrcs = () => {
  const array = [];
  for (let i = 1; i <= 6; i++) {
    array.push(`assets/img${i}.jpg`);
    array.push(`assets/img${i}.jpg`);
  }
  return shuffle(array);
};

/**
 * Creates an array with the length of 12
 * Inside are 12 unique card ids 
 * The array is shuffled
 * @return {array} Shuffled array  
 */
const createArrayOfRandomIDs = () => {
  const array = [];
  for (let i = 1; i <= 12; i++) {
    array.push(`card${i}`);
  }
  return shuffle(array);
};

/**
 * Checks for win and 
 * sets the end screen
 * @param {Array} cards an array of cards
 * @param {HTMLElement} gridNode The grid container
 */
const checkForWin = (cards, gridNode) => {
  let matches = 0;
  cards.forEach((card) => {
    if (card.dataset.match === "true") {
      matches++;
    }
  });
  if (matches === 12) {
    gridNode.innerHTML = "<span>You Win, but no CSS for you</span>"
  }
};

let cardBuffer = null; // Stores the ID and the src of the first card to compare

const randomIDs = createArrayOfRandomIDs();
const randomSrcs = createArrayOfRandomSrcs();
let randomMap = mapFromArrays(randomIDs, randomSrcs);
populateWithCards(grid);
const cards = Array.from(grid.children);

// main game login
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // if 1st card and
    // its not an already matched card and
    // the card wasn't recently open
    if (
      !cardBuffer &&
      card.dataset.match === "false" &&
      card.dataset.open === "false"
    ) {
      showCard(card, randomMap);
      cardBuffer = [card.id, card.children[0].src];

      // if 2nd card and
      // its not an already matched card and
      // the card wasn't recently open
    } else if (
      cardBuffer &&
      card.dataset.match === "false" &&
      card.dataset.open === "false"
    ) {
      showCard(card, randomMap);
      disableAllCards(cards);

      // 1s timeout to  let the user see which cards he chose
      setTimeout(() => {
        if (compareCards(card, cardBuffer)) {
          // If matches

          // Set the second card data match to true
          card.dataset.match = "true";

          // Take the card index from the buffer
          // set first card data match to true
          let index = parseInt(cardBuffer[0].replace("card", ""));
          cards[index - 1].dataset.match = "true";
        } else {
          // If doesn't match

          // hide second card
          hideCard(card);

          // hide first card
          let index = parseInt(cardBuffer[0].replace("card", ""));
          hideCard(cards[index - 1]);
        }
        // clean the card buffer to be ready for next pair
        cardBuffer = null;

        enableAllCards(cards);
        checkForWin(cards, grid);
      }, 1000);
    }
  });
});

onkeydown = event => {
  if(event.code === "Space"){
    window.location.reload()
  }
}