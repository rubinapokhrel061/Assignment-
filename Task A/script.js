let isDown = false;
let startY;
let scrollTop;
const container = document.querySelector(".card-container");
const cards = document.querySelectorAll(".card");

// Start dragging
const start = (e) => {
  isDown = true;
  container.classList.add("active");
  startY = e.pageY || e.touches[0].pageY;
  scrollTop = container.scrollTop;
};

// While dragging
const move = (e) => {
  if (!isDown) return;

  e.preventDefault();
  const y = e.pageY || e.touches[0].pageY;
  const dist = y - startY;
  container.scrollTop = scrollTop - dist;
};

// End dragging
const end = () => {
  isDown = false;
  container.classList.remove("active");
};

// Zoom the center card
const zoomCenterCard = () => {
  const cardHeight = cards[0].offsetHeight + 20;
  const centerPosition = container.scrollTop + container.offsetHeight / 2;
  let centerIndex = Math.floor(centerPosition / cardHeight);
  if (centerIndex >= cards.length) centerIndex = cards.length - 1;
  if (centerIndex < 0) centerIndex = 0;

  cards.forEach((card, index) => {
    if (index === centerIndex) {
      card.classList.add("zoom");
    } else {
      card.classList.remove("zoom");
    }
  });
};

// Prevent scrolling past first and last cards
const preventOverflow = () => {
  const cardHeight = cards[0].offsetHeight + 20;
  const maxScrollTop = cardHeight * (cards.length - 1);

  if (container.scrollTop < 0) container.scrollTop = 0;
  if (container.scrollTop > maxScrollTop) container.scrollTop = maxScrollTop;
};

window.addEventListener("load", zoomCenterCard);

container.addEventListener("scroll", () => {
  zoomCenterCard();
  preventOverflow();
});

container.addEventListener("mousedown", start);
container.addEventListener("touchstart", start);

container.addEventListener("mousemove", move);
container.addEventListener("touchmove", move);

container.addEventListener("mouseleave", end);
container.addEventListener("mouseup", end);
container.addEventListener("touchend", end);
