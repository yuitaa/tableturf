var lang = "ja";

function parsePatternCode(pattern) {
  let out = "";
  let patternCodeSplitted = pattern.split(";");

  out += "0".repeat(Number(patternCodeSplitted[0]));

  patternCodeSplitted[1].split("").forEach((i) => {
    if (Number.isNaN(Number(i))) {
      out += "0".repeat(i.codePointAt(0) - 97);
    } else {
      out += i;
    }
  });
  out = out.split("");
  out = out.map((i) => Number(i));
  return out;
}

function createCardElement(pattern, name, num, specialCost, rarity) {
  const CARD_SIZE = pattern.filter((i) => {
    return 0 < i;
  }).length;

  const CARD_RARITY = ["common", "rare", "fresh"];
  let out = document.createElement("div");
  out.classList.add("tableturf-card");
  out.classList.add("card-" + CARD_RARITY[rarity]);

  let cardNameElement = document.createElement("div");
  cardNameElement.textContent = name;
  cardNameElement.classList.add("card-name");
  out.insertAdjacentElement("beforeend", cardNameElement);

  wrapperElement = document.createElement("div");
  wrapperElement.classList.add("pattern-wrapper");
  for (let i = 0; i < 64; i++) {
    let patternPixel = document.createElement("div");

    if (pattern[i] == 1) {
      patternPixel.classList.add("pixel-regular");
    } else if (pattern[i] == 2) {
      patternPixel.classList.add("pixel-special");
    } else {
      patternPixel.classList.add("pixel-blank");
    }
    wrapperElement.insertAdjacentElement("beforeend", patternPixel);
  }
  out.insertAdjacentElement("beforeend", wrapperElement);

  let detailElement = document.createElement("div");
  detailElement.classList.add("card-detail");

  let sizeElement = document.createElement("div");
  sizeElement.classList.add("card-size");
  sizeElement.textContent = String(CARD_SIZE);
  detailElement.insertAdjacentElement("beforeend", sizeElement);

  let sideElement = document.createElement("div");
  sideElement.textContent = `No. ${num}`;

  let costElement = document.createElement("div");
  costElement.classList.add("special-cost");
  for (let i = 0; i < specialCost; i++) {
    let specialElement = document.createElement("div");
    specialElement.classList.add("pixel-special");
    costElement.insertAdjacentElement("beforeend", specialElement);
  }
  sideElement.insertAdjacentElement("beforeend", costElement);
  detailElement.insertAdjacentElement("beforeend", sideElement);
  out.insertAdjacentElement("beforeend", detailElement);

  return out;
}

function randomize_cards() {
  let cards = [];

  Array.prototype.forEach.call(
    document.getElementsByClassName("leave-card-check"),
    (i) => {
      if (i.checked) {
        cards.push(Number(i.getAttribute("data-card-number")));
      }
    }
  );

  let leftCards = cards.concat();

  document.getElementById("card-container").textContent = "";
  document.getElementById("card-tbody").textContent = "";
  document.getElementById("card-table").classList.remove("invisible");

  while (cards.length < 15) {
    let number = Math.floor(Math.random() * TABLETURF_CARDS.length);
    if (!cards.includes(number)) {
      cards.push(number);
    }
  }

  cards = cards.sort((i, j) => i - j);
  cards.forEach((i) => {
    let pattern = parsePatternCode(TABLETURF_CARDS[i]["pattern"]);
    let name = LOCATE[lang][TABLETURF_CARDS[i]["key"]];
    let num = i + 1;
    let specialCost = TABLETURF_CARDS[i]["sp"];
    let rarity = TABLETURF_CARDS[i]["rarity"];

    document
      .getElementById("card-container")
      .insertAdjacentElement(
        "beforeend",
        createCardElement(pattern, name, num, specialCost, rarity)
      );

    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let tdName = document.createElement("td");
    let tdLeaveCard = document.createElement("td");
    let inputContainer = document.createElement("div");
    let input = document.createElement("input");

    th.textContent = String(num);
    tdName.textContent = name;
    inputContainer.classList.add("form-check");
    inputContainer.classList.add("form-switch");
    input.classList.add("form-check-input");
    input.classList.add("leave-card-check");
    input.setAttribute("type", "checkbox");
    input.setAttribute("data-card-number", String(num - 1));

    if (leftCards.includes(num - 1)) {
      input.setAttribute("checked", true);
    } else {
      input.removeAttribute("checked");
    }

    inputContainer.insertAdjacentElement("beforeend", input);
    tdLeaveCard.insertAdjacentElement("beforeend", inputContainer);
    tr.insertAdjacentElement("beforeend", th);
    tr.insertAdjacentElement("beforeend", tdName);
    tr.insertAdjacentElement("beforeend", tdLeaveCard);
    document
      .getElementById("card-tbody")
      .insertAdjacentElement("beforeend", tr);
  });
}

window.onload = () => {
  if (!(/^ja\b/.test(window.navigator.language))) {
    document.getElementById("language-en").checked = true;
    document.getElementById("generate-deck").textContent = "Generate Deck";
    lang = "en";
  }

  document.getElementById("generate-deck").addEventListener("click", () => {
    if (document.getElementById("language-ja").checked) {
      document.getElementById("th-name").textContent = "カード名";
      document.getElementById("th-leave-card").textContent = "このカードを残す";
      document.getElementById("generate-deck").textContent = "デッキを生成する";
      lang = "ja";
    } else {
      document.getElementById("th-name").textContent = "Name";
      document.getElementById("th-leave-card").textContent = "Keep this Card";
      document.getElementById("generate-deck").textContent = "Generate Deck";
      lang = "en";
    }

    randomize_cards();
  });
  document.getElementById("language-ja").addEventListener("change", () => {
    if (document.getElementById("language-ja").checked) {
      document.getElementById("generate-deck").textContent = "デッキを生成する";
    } else {
      document.getElementById("generate-deck").textContent = "Generate Deck";
    }
  });
  let languageCheckboxes = document.querySelectorAll(`input[name='language']`);

  for (let target of languageCheckboxes) {
    target.addEventListener("change", () => {
      if (document.getElementById("language-ja").checked) {
        document.getElementById("generate-deck").textContent =
          "デッキを生成する";
      } else {
        document.getElementById("generate-deck").textContent = "Generate Deck";
      }
    });
  }
};
