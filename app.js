const grid = document.querySelector("#grid");
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

const disableAllCards = (cards) => {
  cards.forEach((card) => {
    card.style.pointerEvents = "none";
  });
};
const enableAllCards = (cards) => {
  cards.forEach((card) => {
    card.style.pointerEvents = "auto";
  });
};

const showCard = (cardNode, map) => {
  cardNode.children[0].src = map.get(cardNode.id);
  cardNode.dataset.open = "true";
};
const hideCard = (cardNode) => {
  cardNode.children[0].src = "assets/backside.png";
  cardNode.dataset.open = "false";
};

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

const createArrayOfRandomSrcs = () => {
  const array = [];
  for (let i = 1; i <= 6; i++) {
    array.push(`assets/img${i}.jpg`);
    array.push(`assets/img${i}.jpg`);
  }
  return shuffle(array);
};

const createArrayOfRandomIDs = () => {
  const array = [];
  for (let i = 1; i <= 12; i++) {
    array.push(`card${i}`);
  }
  return shuffle(array);
};

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