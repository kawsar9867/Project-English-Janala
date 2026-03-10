const createElement = (arr) => {
  const htmlElements = arr.map(
    (el) =>
      `<span class="btn px-2 bg-green-100 text-green-800 border-green-300 mt-2">${el}</span>`,
  );
  return htmlElements.join(" ");
};

let voices = [];

// যখন voices load হবে তখন list update হবে
speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";

  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }

  // Normal female voice selection
  const normalFemaleVoice =
    voices.find(v => v.name.includes("Samantha")) ||         // Mac OS default female
    voices.find(v => v.name.includes("Zira")) ||             // Windows default female
    voices.find(v => v.name.includes("Google US English")) || // Google default female
    voices[0];                                              // fallback

  utterance.voice = normalFemaleVoice;

  // Normal speed & pitch
  utterance.rate = 1;   // normal speed
  utterance.pitch = 1;  // normal pitch
  utterance.volume = 1; // full volume

  speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //Promis of response
    .then((res) => res.json()) //promis of json data
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); //active class removed
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active"); //add active class
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

document.getElementById("btn-search").addEventListener('click', () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWord(filterWords);
    });
});

const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("detail-container");
  detailsBox.innerHTML = `
    <div class="relative max-w-xl mx-auto mt-5">
    <!-- Card -->
    <div class="p-6 border border-sky-200 rounded-xl shadow-lg bg-white space-y-4 relative">
        <!-- Word Header -->
        <h1 class="font-bold text-3xl font-bangla flex items-center gap-3 flex-wrap">
    ${word.word}
    <span class="text-blue-500 flex items-center gap-1">
        <span class="hidden md:inline-flex">
            <i class="fa-solid fa-microphone-lines"></i>
        </span>
        <span>:</span>
        <span>${word.pronunciation}</span>
    </span>
</h1>
        <!-- Meaning -->
        <div>
            <p class="font-semibold text-lg">Meaning</p>
            <p class="font-bangla mt-1 text-gray-700">
                ${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}
            </p>
        </div>

        <!-- Parts of Speech -->
        <div>
            <p class="font-semibold text-lg mt-4">Parts of Speech</p>
            <p class="text-gray-700 mt-1">${word.partsOfSpeech}</p>
        </div>

        <!-- Example -->
        <div>
            <p class="font-semibold text-lg mt-4">Example</p>
            <p class="text-gray-700 mt-1">${word.sentence}</p>
        </div>

        <!-- Synonyms -->
        <div>
            <p class="font-bangla font-semibold text-lg mt-4">সমার্থক শব্দগুলো</p>
            <div class="flex flex-wrap gap-2 mt-2 ">
                ${word.synonyms.map(syn => `
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:shadow-md">
                        ${syn}
                    </span>
                `).join('')}
            </div>
        </div>
    </div>
</div>
  `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
     <div class="text-center col-span-full space-y-6 rounded-xl py-10">
     <img class="mx-auto" src="./img/alert-error.png"/>
<p class="text-sm font-medium text-gray-500 font-semibold font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি,</p>
<h2 class=" text-3xl font-bold">নেক্সট Lesson এ যান।</h2>
    </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const wordBox = document.createElement("div");
    wordBox.innerHTML = `
         <div class="bg-white rounded-xl shadow-sm text-center px-5 py-10 space-y-4 transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-xl font-semibold  font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/ ${word.pronunciation ? word.pronunciation : "শব্দের উচ্চারণ পাওয়া যায়নি"}"</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;
    wordContainer.append(wordBox);
  });
  manageSpinner(false);
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
         <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-info lesson-btn"
                  ><i class="fa-solid fa-book-open"></i> </i>Lesson - ${lesson.level_no}</button>
         `;
    levelContainer.append(btnDiv);
  }
};
loadLessons();
