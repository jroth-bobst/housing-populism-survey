Qualtrics.SurveyEngine.addOnload(function() {
  const zip = Qualtrics.SurveyEngine.getEmbeddedData('zipInput');

  fetch("https://raw.githubusercontent.com/jroth-bobst/housing-populism-survey/refs/heads/master/Qualtrics/Data_Formatted/sandbox_zip_codes.csv")
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split("\n");
      const header = lines[0].split(",").map(h => h.replace(/"/g, ""));
      const zipIndex = header.indexOf("zip_code");
      const pctIndex = header.indexOf("pct_institution");

      const lookup = {};
      lines.slice(1).forEach(line => {
        const cols = line.split(",");
        const zipCode = cols[zipIndex];
        const value = cols[pctIndex];
        lookup[zipCode] = value;
      });

      const share = lookup[zip];
      if (share) {
        const pct = parseFloat(share).toFixed(1);
        Qualtrics.SurveyEngine.setEmbeddedData('pct_for_zip', pct);
      } else {
        console.warn(`ZIP code ${zip} not found in lookup table.`);
        Qualtrics.SurveyEngine.setEmbeddedData('pct_for_zip', 'NA');
      }
    })
    .catch(error => {
      console.error("Error fetching ZIP code data:", error);
      Qualtrics.SurveyEngine.setEmbeddedData('pct_for_zip', 'NA');
    });
});
