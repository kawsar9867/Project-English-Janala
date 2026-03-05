const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //Promis of response
    .then((res) => res.json()) //promis of json data
    .then((json) => displayLesson(json.data));
};
const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWord(data.data));
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
  }

  words.forEach((word) => {
    console.log(word);
    const wordBox = document.createElement("div");
    wordBox.innerHTML = `
         <div class="bg-white rounded-xl shadow-sm text-center px-5 py-10 space-y-4">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-xl font-semibold  font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/ ${word.pronunciation ? word.pronunciation : "শব্দের উচ্চারণ পাওয়া যায়নি"}"</div>
        <div class="flex justify-between items-center">
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;
    wordContainer.append(wordBox);
  });
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
         <button onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"
                  ><i class="fa-brands fa-leanpub"></i>Lesson - ${lesson.level_no}</button>
         `;
    levelContainer.append(btnDiv);
  }
};
loadLessons();
