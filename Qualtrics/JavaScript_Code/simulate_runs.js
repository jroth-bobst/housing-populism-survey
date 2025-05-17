const fs = require('fs');
const vm = require('vm');

// Number of simulations
const n_sim = 1000000;
const results = [];

// Fake Qualtrics object with embeddedData storage
global.Qualtrics = {
  SurveyEngine: {
    addOnload: function(callback) {
      global.onloadCallback = callback;
    },
    setEmbeddedData: function(key, value) {
      global.embeddedData[key] = value;
    },
    getEmbeddedData: function(key) {
      return global.embeddedData[key];
    }
  }
};

// Load the Qualtrics script in a virtual context
const scriptCode = fs.readFileSync('./survey_randomization.js', 'utf8');
vm.runInThisContext(scriptCode); // This sets global.onloadCallback

// Run the simulation loop
for (let i = 0; i < n_sim; i++) {
  global.embeddedData = {}; // Reset for each run

  // Trigger the code block from survey_randomization.js
  onloadCallback();

  // Collect all needed variables
  results.push({
    comparison: global.embeddedData["comparison"],
    candidate_1_1: global.embeddedData["C1_1"],
    candidate_1_2: global.embeddedData["C1_2"],
    candidate_2_1: global.embeddedData["C2_1"],
    candidate_2_2: global.embeddedData["C2_2"],
    candidate_3_1: global.embeddedData["C3_1"],
    candidate_3_2: global.embeddedData["C3_2"],
    candidate_4_1: global.embeddedData["C4_1"],
    candidate_4_2: global.embeddedData["C4_2"],
    candidate_5_1: global.embeddedData["C5_1"],
    candidate_5_2: global.embeddedData["C5_2"]
  });
}

// Create timestamped filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `simulation_results_${timestamp}.json`;

// Save results to a file
fs.writeFileSync(filename, JSON.stringify(results, null, 2));

console.log(`Saved ${n_sim} simulations to ${filename}`);
