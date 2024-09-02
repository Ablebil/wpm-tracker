let randomText = [];
let selectedLang;

const text = document.querySelector(".text");
const inputField = document.getElementById("user-input");
const resultField = document.querySelector(".result");
const errorField = document.querySelector(".error");

let startTime;
let hasStartedTyping = false;

document.addEventListener("DOMContentLoaded", () => {
  inputField.focus();
  selectLang("id");
  generateRandomWord(10);
});

window.addEventListener("input", () => {
  inputField.focus();
});

// Select language based on user's choice
function selectLang(lang) {
  selectedLang = lang;
  inputField.value = ""; // Clear input field
  text.innerHTML = ""; // Clear displayed text
  generateRandomWord(10); // Generate new words with default count
}

// Generate random words based on user's choice
async function generateRandomWord(n) {
  const response = await fetch(`data/${selectedLang}.json`);
  const arrayOfWord = await response.json();

  const uniqueWords = new Set();
  while (uniqueWords.size < n) {
    const index = Math.floor(Math.random() * arrayOfWord.length);
    uniqueWords.add(arrayOfWord[index]);
  }
  randomText = Array.from(uniqueWords);

  displayText(randomText.join(" ")); // Display random words
}

function displayText(textContent) {
  const originalWords = textContent.split(" ");
  let html = "";

  originalWords.forEach((word, wordIndex) => {
    const wordSpan = word
      .split("")
      .map(
        (char, charIndex) =>
          `<span class="word-${wordIndex}-char-${charIndex}">${char}</span>`
      )
      .join("");

    html += `<span class="word-${wordIndex}">${wordSpan} </span>`;
  });

  text.innerHTML = html.trim();
}

inputField.addEventListener("input", () => {
  if (!hasStartedTyping) {
    startTime = new Date().getTime(); // Record start time on first keystroke
    hasStartedTyping = true;
  }
  highlightErrors(); // Call highlightErrors on every input event
});

inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") calculate();
});

function calculate() {
  const endTime = new Date().getTime(); // Record end time
  const userInput = inputField.value.trim(); // Get user's input without extra spaces

  const timeSpentInMinutes = (endTime - startTime) / 60000; // Convert time spent to minutes
  const wpm = userInput.split(" ").length / timeSpentInMinutes; // Calculate WPM

  checkError(userInput, wpm);
}

function highlightErrors() {
  const userInput = inputField.value.trim();
  const userWords = userInput.split(" ");
  const originalWords = randomText;

  // Clear previous highlights
  document
    .querySelectorAll(".char")
    .forEach((span) => span.classList.remove("incorrect-char"));

  originalWords.forEach((originalWord, wordIndex) => {
    const userWord = userWords[wordIndex] || "";

    // Compare up to the length of the originalWord or userWord, whichever is shorter
    const maxLength = Math.max(originalWord.length, userWord.length);

    for (let charIndex = 0; charIndex < maxLength; charIndex++) {
      const originalChar = originalWord[charIndex] || "";
      const userChar = userWord[charIndex] || "";

      const charElement = document.querySelector(
        `.word-${wordIndex}-char-${charIndex}`
      );
      if (charElement) {
        if (userChar !== originalChar) {
          // If userChar is present and does not match originalChar, mark it as incorrect
          charElement.classList.add("incorrect-char");
        } else {
          // If userChar is missing and originalChar is present, mark originalChar as incorrect
          if (!userChar && originalChar) {
            charElement.classList.add("incorrect-char");
          } else {
            charElement.classList.remove("incorrect-char"); // Remove incorrect mark if corrected
          }
        }
      }
    }
  });
}

function checkError(userInput, wpm) {
  const userWords = userInput.trim().split(" ");
  const randomWords = randomText.join(" ").trim().split(" ");

  let totalWords = 0;
  let totalCorrectChars = 0;
  let totalChars = 0;

  // Compare words
  for (let i = 0; i < randomWords.length; i++) {
    const originalWord = randomWords[i] || "";
    const userWord = userWords[i] || "";

    totalWords++;

    // Compare characters
    let correctChars = 0;
    let totalWordChars = Math.max(originalWord.length, userWord.length);

    for (let j = 0; j < totalWordChars; j++) {
      if (originalWord[j] === userWord[j]) {
        correctChars++;
      }
      totalChars++;
    }

    totalCorrectChars += correctChars;
  }

  // Calculate accuracy and WPM
  const accuracy = (totalCorrectChars / totalChars) * 100;
  const errorRate = 1 - totalCorrectChars / totalChars;
  const trueWpm = wpm * (1 - errorRate); // Adjust WPM based on error rate

  // Display results
  resultField.textContent = `Your speed is ${trueWpm.toFixed(2)} WPM`;
  errorField.textContent = `${accuracy.toFixed(2)}% accuracy`;
}
