"use strict";

import { DATA_URL, KEY_API } from "./config.js";

const CATEGORIES = [
  { name: "technology", color: "bg-sky-700" },
  { name: "science", color: "bg-green-700" },
  { name: "finance", color: "bg-red-700" },
  { name: "society", color: "bg-yellow-700" },
  { name: "entertainment", color: "bg-pink-700" },
  { name: "health", color: "bg-cyan-700" },
  { name: "history", color: "bg-amber-700" },
  { name: "news", color: "bg-purble-700" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindBlowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindBlowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindBlowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];
//// ==== ELEMENT DOM
const form = document.getElementById("form");
const btnOpen = document.getElementById("btn-open");
const factsList = document.getElementById("facts-list");

// factsList.innerHTML = "";

///// ===== LOAD DATA FROM SUPERBASE
const loadData = async function (url, key) {
  try {
    const res = await fetch(url, {
      headers: {
        apikey: key,
        autorization: `Bearer ${key}`,
      },
    });
    const data = await res.json();
    functionCreateFacts(data);
  } catch (error) {
    console.error(error);
  }
};
loadData(DATA_URL, KEY_API);
///// ===== CREATE DOM ELEMENTS
const functionCreateFacts = function (dataArr) {
  const htmlArr = dataArr.map((fact) => {
    return `<li id="${fact.id}"
                   class="bg-stone-700 rounded-2xl px-6 py-4 grid lg:grid-cols-4 justify-between gap-2 items-center"
                   >
                      <div class="col-span-3 lg:flex items-center justify-between">
                          <p class="xl:text-xl font-mono leading-normal">
                            ${fact.text}
                            <a
                              class="text-stone-400 hover:text-sky-500    visited:ml-3 duration-300 visited:transition ml-3  transition active:text-sky-500   visited:text-stone-400"
                              href="${fact.source}"
                              >(source)</a
                            >
                          </p>
                          <span id="category"
                            class="text-sm font-bold rounded-full lg:ml-10 uppercase  px-2.5 py-1 ${
                              CATEGORIES.find((el) => el.name === fact.category)
                                .color
                            }"
                            >#${fact.category}#</span
                          >
                      </div>
                      <div class="flex gap-2 lg:ml-6">
                          <button
                            class="flex px-3 transition duration-300 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
                          >
                            👍🏻
                            <p class="bold">${fact.votesInteressing}</p>
                          </button>
                          <button
                            class="flex px-3 transition duration-300 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
                          >
                            🤯
                            <p class="bold">${fact.votesMindBlowing}</p>
                          </button>
                          <button
                            class="flex px-3 transition duration-300 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
                          >
                            ⛔️
                            <p class="bold">${fact.votesFalse}</p>
                          </button>
                      </div>
                  </li>
              `;
  });
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
};

///// ===== EVENT LISTENER
btnOpen.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    form.classList.add("flex");
    btnOpen.textContent = "Close";
  } else {
    form.classList.add("hidden");
    form.classList.remove("flex");
    btnOpen.textContent = "Share a fact";
  }
});
