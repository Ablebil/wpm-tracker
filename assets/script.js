let randomText = [];
const arrayOfWord = [
  "sapu",
  "meja",
  "kursi",
  "pintu",
  "jendela",
  "buku",
  "pena",
  "kertas",
  "sepatu",
  "tas",
  "gelas",
  "piring",
  "sendok",
  "garpu",
  "lampu",
  "bantal",
  "kasur",
  "lemari",
  "televisi",
  "kulkas",
];

const text = document.querySelector(".text");
const inputField = document.getElementById("user-input");
const calculateButton = document.getElementById("calculate");
const resultField = document.querySelector(".result");
const errorField = document.querySelector(".error");

let startTime;
let hasStartedTyping = false;

// Select 5 random words from arrayOfWord
for (let i = 0; i < 5; i++) {
  let index = Math.floor(Math.random() * arrayOfWord.length);
  randomText.push(arrayOfWord[index]);
  arrayOfWord.splice(index, 1); // Remove the selected word to avoid repetition
}

text.textContent = randomText.join(" "); // Display random words

inputField.addEventListener("input", () => {
  if (!hasStartedTyping) {
    startTime = new Date().getTime(); // Record start time on first keystroke
    hasStartedTyping = true;
  }
});

function calculate() {
  const endTime = new Date().getTime(); // Record end time
  const userInput = inputField.value.trim(); // Get user's input without extra spaces

  const timeSpentInMinutes = (endTime - startTime) / 60000; // Convert time spent to minutes
  const wpm = userInput.split(" ").length / timeSpentInMinutes; // Calculate WPM

  checkError(userInput, wpm);
}

calculateButton.addEventListener("click", calculate);
inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") calculate();
});

function checkError(userInput, wpm) {
  const arrayOfUserInput = userInput.split(" ");

  let correct = 0;
  let wrong = 0;

  // Compare user's input with the random text
  for (let i = 0; i < arrayOfUserInput.length; i++) {
    if (arrayOfUserInput[i] === randomText[i]) {
      correct++;
    } else {
      wrong++;
    }
  }

  const errorRate = wrong / arrayOfUserInput.length;
  const trueWpm = wpm * (1 - errorRate); // Adjust WPM based on error rate

  // Display results
  resultField.textContent = `Your speed is ${trueWpm.toFixed(2)} WPM`;
  errorField.textContent = `${((correct / randomText.length) * 100).toFixed(
    2
  )}% accuracy`;
}
