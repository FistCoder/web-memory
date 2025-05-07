const grid = document.querySelector("#grid");

const populateWithCards = (gridNode) => {
  for (let i = 1; i <= 12; i++) {
    const card = document.createElement("div");
    const img = document.createElement("img");
    img.src = `assets/backside.png`;
    img.classList.add("card-image");
    card.setAttribute("data-match", "false");
    card.id = `card${i}`;
    card.classList.add("card");
    card.classList.add("card-closed");
    card.appendChild(img);
    gridNode.appendChild(card);
  }
};

const disableAllCards = (cards) => {
  cards.forEach(card => {
    card.style.pointerEvents = 'none';})
};
const enableAllCards = (cards) => {
  cards.forEach(card => {
    card.style.pointerEvents = 'auto';})
};

const showCard = (cardNode, map) => {
  cardNode.children[0].src = map.get(cardNode.id);
};
const hideCard = (cardNode) => {
  cardNode.children[0].src = "assets/backside.png";
};

const compareCards = (cardNode, cardBuffer) => {
  if (cardNode.children[0].src === cardBuffer[1]) {
    console.log("match");
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
const mapFromArrays = (array1, array2) => {
  const map = new Map();
  for (let i = 0; i < array1.length; i++) {
    map.set(array1[i], array2[i]);
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

let cardBuffer = null; // Stores the ID and the src of the first card to compare

const randomIDs = createArrayOfRandomIDs();
const randomSrcs = createArrayOfRandomSrcs();
let randomMap = mapFromArrays(randomIDs, randomSrcs);
populateWithCards(grid);
const cards = Array.from(grid.children);

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!cardBuffer) {
      showCard(card, randomMap);
      cardBuffer = [card.id, card.children[0].src];
    } else {
      showCard(card, randomMap);
      disableAllCards(cards);
      setTimeout(() => {
        if (compareCards(card, cardBuffer)) {
          card.dataset.match = "true";

          // On récupère l'index de la carte dans le buffer
          let index = parseInt(cardBuffer[0].replace("card", ""));
          cards[index - 1].dataset.match = "true";
        } else {
          hideCard(card);
          console.log(card);
          let index = parseInt(cardBuffer[0].replace("card", ""));
          console.log(cards[index - 1]);
          hideCard(cards[index - 1]);
        }
        cardBuffer = null;
        enableAllCards(cards);
      }, 1000);
    }
  });
});
