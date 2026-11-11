const surahSelect = document.getElementById("surahSelect");
const ayahSelect = document.getElementById("ayahSelect");
const surahName = document.getElementById("surahName");
const ayahText = document.getElementById("ayahText");
const quranAudio = document.getElementById("quranAudio");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

let selectedSurah = null;
let selectedAyah = null;

// Load all Surahs when page opens
async function loadSurahs() {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await response.json();

    surahSelect.innerHTML = '<option value="">Select Surah</option>';

    data.data.forEach(surah => {
      const option = document.createElement("option");
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
      surahSelect.appendChild(option);
    });
  } catch (error) {
    surahSelect.innerHTML = '<option value="">Failed to load Surahs</option>';
    console.error("Error loading Surahs:", error);
  }
}

// Load verses when a Surah is selected
async function loadAyahs(surahNumber) {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad,ar.alafasy`
    );
    const data = await response.json();

    const arabic = data.data[0];
    const english = data.data[1];
    const audio = data.data[2];

    selectedSurah = {
      arabic,
      english,
      audio
    };

    surahName.textContent = `${arabic.number}. ${arabic.englishName} — ${arabic.name}`;
    ayahText.textContent = "Select a verse to read and listen.";

    ayahSelect.innerHTML = '<option value="">Select Verse</option>';
    ayahSelect.disabled = false;

    arabic.ayahs.forEach((ayah, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `Ayah ${ayah.numberInSurah}`;
      ayahSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading Ayahs:", error);
    ayahText.textContent = "Could not load verses. Please try again.";
  }
}

// Show selected verse and set audio
function showAyah(index) {
  const arabicAyah = selectedSurah.arabic.ayahs[index];
  const englishAyah = selectedSurah.english.ayahs[index];
  const audioAyah = selectedSurah.audio.ayahs[index];

  selectedAyah = index;

  ayahText.innerHTML = `
    <p class="arabic">${arabicAyah.text}</p>
    <p class="translation">${englishAyah.text}</p>
  `;

  quranAudio.src = audioAyah.audio;
}

// Events
surahSelect.addEventListener("change", (e) => {
  const surahNumber = e.target.value;

  if (surahNumber) {
    loadAyahs(surahNumber);
  } else {
    ayahSelect.innerHTML = '<option value="">Select Surah first</option>';
    ayahSelect.disabled = true;
  }
});

ayahSelect.addEventListener("change", (e) => {
  if (e.target.value !== "") {
    showAyah(e.target.value);
  }
});

playBtn.addEventListener("click", () => {
  if (selectedAyah !== null) {
    quranAudio.play();
  } else {
    alert("Please select a Surah and verse first.");
  }
});

pauseBtn.addEventListener("click", () => {
  quranAudio.pause();
});

stopBtn.addEventListener("click", () => {
  quranAudio.pause();
  quranAudio.currentTime = 0;
});

// Start app
loadSurahs();