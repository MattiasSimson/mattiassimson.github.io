const noteConfig = {
    octave2: [
      { note: "C2", frequency: 65.40 },
      { note: "C#2", frequency: 69.30 },
      { note: "D2", frequency: 73.42 },
      { note: "D#2", frequency: 77.78 },
      { note: "E2", frequency: 82.41 },
      { note: "F2", frequency: 87.31 },
      { note: "F#2", frequency: 92.50 },
      { note: "G2", frequency: 98.00 },
      { note: "G#2", frequency: 103.83 },
      { note: "A2", frequency: 110.00 },
      { note: "A#2", frequency: 116.54 },
      { note: "B2", frequency: 123.47 }
    ],
    octave3: [
      { note: "C3", frequency: 130.81 },
      { note: "C#3", frequency: 138.59 },
      { note: "D3", frequency: 146.83 },
      { note: "D#3", frequency: 155.56 },
      { note: "E3", frequency: 164.81 },
      { note: "F3", frequency: 174.61 },
      { note: "F#3", frequency: 185.00 },
      { note: "G3", frequency: 196.00 },
      { note: "G#3", frequency: 207.65 },
      { note: "A3", frequency: 220.00 },
      { note: "A#3", frequency: 233.08 },
      { note: "B3", frequency: 246.94 }
    ],
    octave4: [
      { note: "C4", frequency: 261.63 },
      { note: "C#4", frequency: 277.18 },
      { note: "D4", frequency: 293.66 },
      { note: "D#4", frequency: 311.13 },
      { note: "E4", frequency: 329.63 },
      { note: "F4", frequency: 349.23 },
      { note: "F#4", frequency: 369.99 },
      { note: "G4", frequency: 392.00 },
      { note: "G#4", frequency: 415.30 },
      { note: "A4", frequency: 440.00 },
      { note: "A#4", frequency: 466.16 },
      { note: "B4", frequency: 493.88 }
    ],
    octave5: [
      { note: "C5", frequency: 523.25 },
      { note: "C#5", frequency: 554.37 },
      { note: "D5", frequency: 587.33 },
      { note: "D#5", frequency: 622.25 },
      { note: "E5", frequency: 659.25 },
      { note: "F5", frequency: 698.46 },
      { note: "F#5", frequency: 739.99 },
      { note: "G5", frequency: 783.99 },
      { note: "G#5", frequency: 830.61 },
      { note: "A5", frequency: 880.00 },
      { note: "A#5", frequency: 932.33 },
      { note: "B5", frequency: 987.77 }
    ],
/*     special: [
        { note: "5K", frequency: 5000.00 },
        { note: "10K", frequency: 10000.00 },
        { note: "20K", frequency: 20000.00 },
        { note: "500", frequency: 500.00 },
        { note: "250", frequency: 250.00 },
        { note: "100", frequency: 100.00 },
        { note: "50", frequency: 50.00 },
        { note: "1K", frequency: 1000.00 },
        { note: "2K", frequency: 2000.00 },
       
      ] */
  };


const notes = [];
const noteFrequencies = {};

// Generate `notes` and `noteFrequencies`
for (const octave in noteConfig) {
  noteConfig[octave].forEach(noteInfo => {
    notes.push(noteInfo.note);
    noteFrequencies[noteInfo.note] = noteInfo.frequency;
  });
}

let currentNote; 
let score = 0;
let oscillator;
let noiseEnabled = false; // Variable to store noise checkbox state
let selectedOctaves = ["octave2", "octave3", "octave4", "octave5"]; // Initially all standard octaves selected



// Function to create a single note button
function createNoteButton(noteId) {
    const button = document.createElement('button');
    button.className = 'noteButton';
    button.id = noteId;
  
    const frequencySpan = document.createElement('span');
    frequencySpan.style.color = getColorForOctave(noteId); // Apply color based on octave
    frequencySpan.textContent = noteFrequencies[noteId];
  
    const noteNameSpan = document.createElement('span');
    noteNameSpan.className = 'noteName';
    noteNameSpan.textContent = noteId;
  
    button.appendChild(frequencySpan);
    button.appendChild(noteNameSpan);
  
    return button;
  }
  
  // Helper function to get a color for the octave
  function getColorForOctave(noteId) {
    const frequency = noteFrequencies[noteId];
    
    // Define frequency ranges for colors (adjust as needed)
    if (frequency >= 65 && frequency < 131) { // Check the noteFrequencies dictionary for exact match
      return '#000080'; 
    } else if (frequency >= 131 && frequency < 262) {
      return 'blue';
    } else if (frequency >= 262 && frequency < 524) {
      return 'green';
    } else if (frequency >= 524) { 
      return 'rgb(255, 130, 0)';
    } else {
      return 'black'; // Default color in case something is incorrect
    }
  }
  
  // Create and append button elements
  const container = document.getElementById('noteButtonsContainer'); 
  
  notes.forEach(note => {
      const button = createNoteButton(note);
      container.appendChild(button);
  });

  
document.getElementById('showNames').addEventListener('change', function() {
let noteNames = document.querySelectorAll('.noteName');

if (this.checked) {
noteNames.forEach(name => name.style.display = 'inline'); // Show names
} else {
noteNames.forEach(name => name.style.display = 'none'); // Hide names
}
});


const audioCtx = new AudioContext();

function playNote(note) {
oscillator = audioCtx.createOscillator();
const sineGain = audioCtx.createGain(); // Create gain node for the sine wave

oscillator.type = "sine";
oscillator.frequency.setValueAtTime(getFrequency(note), audioCtx.currentTime);
oscillator.connect(sineGain); // Connect oscillator to sineGain
sineGain.connect(audioCtx.destination);
sineGain.gain.value = 0.05; // Adjust sine wave volume here


if (noiseEnabled) {
const noise = audioCtx.createBufferSource();
const bufferSize = 2 * audioCtx.sampleRate;
const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
const output = noiseBuffer.getChannelData(0);

for (let i = 0; i < bufferSize; i++) {
output[i] = Math.random() * 2 - 1;
}

noise.buffer = noiseBuffer;
noise.loop = true;
noise.start(0);

const noiseGain = audioCtx.createGain();
noiseGain.gain.value = 0.05; // Adjust noise volume here
noise.connect(noiseGain);
noiseGain.connect(audioCtx.destination);

setTimeout(() => {
noise.stop();
noise.disconnect();
}, 500); // Stop noise after 0.5 seconds

// Adjust sine wave volume when noise is enabled
sineGain.gain.value = 0.01; // Adjust sine wave volume here
} else {
// Reset sine wave volume when noise is disabled
sineGain.gain.value = 0.05; // Reset sine wave volume to full
}

oscillator.start();

setTimeout(() => {
stopNote();
}, 500); 
}

function stopNote() {
if (oscillator) {
oscillator.stop();
oscillator = null;
}
}

function getFrequency(note) {
return noteFrequencies[note];
}



function resetColors() {
document.querySelectorAll(".noteButton").forEach(btn => btn.classList.remove("active", "wrong"));
}

function chooseAndPlayNote() {
currentNote = notes[Math.floor(Math.random() * notes.length)];
playNote(currentNote);  
}


document.getElementById("playButton").addEventListener("click", chooseAndPlayNote);
document.getElementById("repeatButton").addEventListener("click", () => {
if (currentNote) {
playNote(currentNote);
}
});

// Toggle noise checkbox
document.getElementById("noiseCheckbox").addEventListener("change", function() {
noiseEnabled = this.checked;
});

document.querySelectorAll(".noteButton").forEach(button => button.addEventListener("click", () => { 
if (button.id !== "playButton" && button.id !== "repeatButton") { 
if (button.id === currentNote) {
score++;
document.getElementById("score").textContent = score;
button.classList.add("active"); 
setTimeout(() => {
button.classList.remove("active"); 
}, 500); 
chooseAndPlayNote(); 
} else {
button.classList.add("wrong"); 
setTimeout(() => {
button.classList.remove("wrong"); 
}, 500);  
}
}
}));



chooseAndPlayNote(); 

