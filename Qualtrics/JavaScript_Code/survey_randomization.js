Qualtrics.SurveyEngine.addOnload(function() {

  // Define statements as arrays
  const all_statements = ["P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B"];
  const ban_statements = ["P_A", "P_B", "R_A", "R_B"];
  const no_ban_statements = ["M_A", "M_B", "T_A", "T_B"];
  
  // Define helper functions
  function report_position(x) {
    if (ban_statements.includes(x)) return "ban";
    if (no_ban_statements.includes(x)) return "no_ban";
    throw new Error("invalid position specified");
  }

  // Define filter helper
  function filterNotStartingWith(arr, frame) {
    return arr.filter(item => !item.startsWith(frame));
  }

  // Generate comparisons array
  const n_pairs = 5;
  const n_same = Math.floor(Math.random() * 2) + 2; // 2 or 3
  const n_different = n_pairs - n_same;

  let comparisons = [
    ...Array(n_same).fill("same_position"),
    ...Array(n_different).fill("different_position")
  ];

  // Shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  comparisons = shuffle(comparisons);
  
  
	function remove(arr, itemsToRemove) {
		// Remove duplicates from itemsToRemove
		let uniqueItemsToRemove = [...new Set(itemsToRemove)];

	  // Filter out only the items that are in the uniqueItemsToRemove list
		return arr.filter(x => !uniqueItemsToRemove.includes(x));
	}
	
   function sample(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
   }
  
	// Function to randomly assign two different parties
	 let all_parties = ["Democrat", "Independent", "Republican"];
    function assignParties() {
        let party_1 = sample(all_parties);
        let party_2 = sample(remove(all_parties, [party_1]));
        return [party_1, party_2];
    }
    
  // Function to tranlsate to full labels
	function fullLabel(code) {
		let map = {
			P: "Populism",
			R: "Rights",
			M: "Market",
			T: "Tradeoffs"
		};
		let [prefix, suffix] = code.split("_");
		return map[prefix] + "_" + suffix;
	}
	
  // Helper function sampleOne: picks a random element from an array
  function sampleOne(arr) {
    if (arr.length === 0) throw new Error("sampleOne called with empty array");
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }
  
  
  // initialize indicator of whether we are reversing the comparison order
  let mark_reverse = false;
  
  // for the scenario d/d/s/s/d, it was easier to code the constraints in the reverse order
  // so we reverse the comparisons array, run the code, then reverse the pairs at the end
  if (JSON.stringify(comparisons) === JSON.stringify(["different_position", "different_position", "same_position", "same_position", "different_position"])) {
    mark_reverse = true;
    orig_comparisons = [...comparisons]; // store original comparisons
    comparisons = comparisons.slice().reverse();
  }


  /////////////////////////////////////////////
  ////////////////// PAIR 1 ///////////////////
  /////////////////////////////////////////////
  let candidate_1_1 = all_statements[Math.floor(Math.random() * all_statements.length)];
  const position_candidate_1_1 = report_position(candidate_1_1);
  const frame_candidate_1_1 = candidate_1_1.charAt(0);
  
  
  let remaining_options;
  if (comparisons[0] === "same_position") {
    if (position_candidate_1_1 === "ban") {
      remaining_options = filterNotStartingWith(ban_statements, frame_candidate_1_1);
    } else if (position_candidate_1_1 === "no_ban") {
      remaining_options = filterNotStartingWith(no_ban_statements, frame_candidate_1_1);
    }
  } else if (comparisons[0] === "different_position") {
    if (position_candidate_1_1 === "ban") {
      remaining_options = no_ban_statements.slice();
    } else if (position_candidate_1_1 === "no_ban") {
      remaining_options = ban_statements.slice();
    }
  } else {
    throw new Error("invalid value of comparisons[0]");
  }
  

  let candidate_1_2 = remaining_options[Math.floor(Math.random() * remaining_options.length)];

  // Keep track of used profiles
  let used_profiles = [];
  used_profiles.push(candidate_1_1, candidate_1_2);
  
  
  
  /////////////////////////////////////////////
  ////////////////// PAIR 2 ///////////////////
  /////////////////////////////////////////////
  // Filter set difference helper
  function setdiff(a, b) {
    return a.filter(x => !b.includes(x));
  }
  
  let remaining_pool_2_1 = setdiff(all_statements, used_profiles);
  // Exclude frames already chosen (first letter of used_profiles)
  const excluded_start_2_1 = used_profiles.map(x => x.charAt(0));
  // Filter all_statements whose first letter NOT in excluded_start_2_1
  remaining_pool_2_1 = all_statements.filter(x => !excluded_start_2_1.includes(x.charAt(0)));
  
  let candidate_2_1 = remaining_pool_2_1[Math.floor(Math.random() * remaining_pool_2_1.length)];
  const position_candidate_2_1 = report_position(candidate_2_1);
  const frame_candidate_2_1 = candidate_2_1.charAt(0);
  
  // Filter ban_statements and no_ban_statements excluding frame_candidate_2_1
  const ban_statements_2_2 = ban_statements.filter(x => !x.startsWith(frame_candidate_2_1));
  const no_ban_statements_2_2 = no_ban_statements.filter(x => !x.startsWith(frame_candidate_2_1));
  
  //  Decide remaining_pool_2_2 based on comparisons[2] and position_candidate_2_1
  let remaining_pool_2_2;
  
  if (comparisons[1] === "same_position") {
    if (position_candidate_2_1 === "ban") {
      remaining_pool_2_2 = ban_statements_2_2;
    } else if (position_candidate_2_1 === "no_ban") {
      remaining_pool_2_2 = no_ban_statements_2_2;
    }
  } else if (comparisons[1] === "different_position") {
    if (position_candidate_2_1 === "ban") {
      remaining_pool_2_2 = setdiff(no_ban_statements, [candidate_2_1]);
    } else if (position_candidate_2_1 === "no_ban") {
      remaining_pool_2_2 = setdiff(ban_statements, [candidate_2_1]);
    }
  } else {
    throw new Error("invalid value of comparisons[2]");
  }
  
  // Exclude candidate_1_1, candidate_1_2, candidate_2_1 from remaining_pool_2_2 (constraint C2)
  remaining_pool_2_2 = setdiff(remaining_pool_2_2, [candidate_1_1, candidate_1_2, candidate_2_1]);
  
  let candidate_2_2 = remaining_pool_2_2[Math.floor(Math.random() * remaining_pool_2_2.length)];
  used_profiles.push(candidate_2_1, candidate_2_2);
  

  
  /////////////////////////////////////////////
  ////////////////// PAIR 3 ///////////////////
  /////////////////////////////////////////////
  // Helper for set difference
  function setdiff(a, b) {
    return a.filter(x => !b.includes(x));
  }
  
  // Count occurrences of first letters in an array
  function countFirstLetters(arr) {
    const counts = {};
    arr.forEach(x => {
      const firstChar = x.charAt(0);
      counts[firstChar] = (counts[firstChar] || 0) + 1;
    });
    return counts;
  }
  
  let remaining_pool_3_1 = setdiff(all_statements, used_profiles);
  const remaining_frames_3_1 = remaining_pool_3_1.map(x => x.charAt(0));
  
  // find frames with at least two unused statements
  const counts = countFirstLetters(remaining_pool_3_1);
  const remaining_frames_with_both_3_1 = Object.entries(counts)
    .filter(([frame, count]) => count > 1)
    .map(([frame]) => frame);
  
  // if any such frame exists, filter remaining_pool_3_1 to only those frames
  if (remaining_frames_with_both_3_1.length > 0) {
    remaining_pool_3_1 = remaining_pool_3_1.filter(x => remaining_frames_with_both_3_1.includes(x.charAt(0)));
  }
  
  // sample candidate_3_1
  let candidate_3_1 = remaining_pool_3_1[Math.floor(Math.random() * remaining_pool_3_1.length)];
  
  // position and frame for candidate_3_1
  const position_candidate_3_1 = report_position(candidate_3_1);
  const frame_candidate_3_1 = candidate_3_1.charAt(0);
  
  // construct remaining_pool_3_2 depending on comparisons[3] and position_candidate_3_1
  let remaining_pool_3_2;
  
  if (comparisons[2] === "same_position") {
    if (position_candidate_3_1 === "ban") {
      // ban_statements excluding frame_candidate_3_1
      const ban_statements_3_2 = ban_statements.filter(x => !x.startsWith(frame_candidate_3_1));
      remaining_pool_3_2 = setdiff(ban_statements_3_2, used_profiles);
      if (remaining_pool_3_2.length === 0) {
        remaining_pool_3_2 = ban_statements_3_2;
      }
    } else if (position_candidate_3_1 === "no_ban") {
      const no_ban_statements_3_2 = no_ban_statements.filter(x => !x.startsWith(frame_candidate_3_1));
      remaining_pool_3_2 = setdiff(no_ban_statements_3_2, used_profiles);
      if (remaining_pool_3_2.length === 0) {
        remaining_pool_3_2 = no_ban_statements_3_2;
      }
    }
  } else if (comparisons[2] === "different_position") {
    if (position_candidate_3_1 === "ban") {
      remaining_pool_3_2 = setdiff(no_ban_statements, used_profiles);
      if (remaining_pool_3_2.length === 0) {
        remaining_pool_3_2 = no_ban_statements;
      }
    } else if (position_candidate_3_1 === "no_ban") {
      remaining_pool_3_2 = setdiff(ban_statements, used_profiles);
      if (remaining_pool_3_2.length === 0) {
        remaining_pool_3_2 = ban_statements;
      }
    }
  } else {
    throw new Error("invalid value of comparisons[3]");
  }
  
  // Exclude candidate_2_1, candidate_2_2, candidate_3_1 to enforce constraint C2
  remaining_pool_3_2 = setdiff(remaining_pool_3_2, [candidate_2_1, candidate_2_2, candidate_3_1]);
  let candidate_3_2 = remaining_pool_3_2[Math.floor(Math.random() * remaining_pool_3_2.length)];
  used_profiles.push(candidate_3_1, candidate_3_2);
  
  
  
  /////////////////////////////////////////////
  ////////////////// PAIR 4 ///////////////////
  /////////////////////////////////////////////
  // determine which statements are still required (not yet used)
  let required_statements_after_3 = setdiff(all_statements, used_profiles);
  
  let required_frames_after_3 = required_statements_after_3.map(x => x.charAt(0));
  
  // find frames that appear more than once (table > 1)
  const frameCounts = {};
  required_frames_after_3.forEach(f => { frameCounts[f] = (frameCounts[f] || 0) + 1; });
  const required_frame_4_1 = Object.keys(frameCounts).filter(f => frameCounts[f] > 1);
  // check length constraint (0 or 1)
  if (!(required_frame_4_1.length === 0 || required_frame_4_1.length === 1)) {
    throw new Error("Invariant violated: required_frame_4_1 length must be 0 or 1");
  }
  
  // choose candidate_4_1 depending on presence of required frame
  let candidate_4_1;
  if (required_frame_4_1.length > 0) {
    // Select required statements with that frame prefix
    const required_statements_4_1 = required_statements_after_3.filter(
      x => required_frame_4_1.includes(x.charAt(0))
    );
    candidate_4_1 = required_statements_4_1[Math.floor(Math.random() * required_statements_4_1.length)];
  } else {
    // No required frame with duplicates, sample from all required statements
    candidate_4_1 = required_statements_after_3[Math.floor(Math.random() * required_statements_after_3.length)];
  }
  
  // get position and frame of candidate_4_1
  const position_candidate_4_1 = report_position(candidate_4_1);
  const frame_candidate_4_1 = candidate_4_1.charAt(0);
  used_profiles.push(candidate_4_1);
  
  // identify statements that have duplicates in used_profiles (excluded_statements_4_2)
  const usedCounts = {};
  used_profiles.forEach(x => { usedCounts[x] = (usedCounts[x] || 0) + 1; });
  const excluded_statements_4_2 = Object.keys(usedCounts).filter(k => usedCounts[k] > 1);
  
  // get ban and no_ban statements excluding duplicates
  const ban_statements_4_2 = setdiff(ban_statements, excluded_statements_4_2);
  const no_ban_statements_4_2 = setdiff(no_ban_statements, excluded_statements_4_2);
  
  // build remaining_pool_4_2 depending on comparisons[4] and position_candidate_4_1
  let remaining_pool_4_2;
  
  if (comparisons[3] === "same_position") {
    if (position_candidate_4_1 === "ban") {
      // Exclude statements starting with frame_candidate_4_1 (including candidate_4_1)
      const filtered_ban = ban_statements_4_2.filter(x => !x.startsWith(frame_candidate_4_1));
      remaining_pool_4_2 = setdiff(filtered_ban, used_profiles);
      if (remaining_pool_4_2.length === 0) {
        remaining_pool_4_2 = filtered_ban;
      }
    } else if (position_candidate_4_1 === "no_ban") {
      const filtered_no_ban = no_ban_statements_4_2.filter(x => !x.startsWith(frame_candidate_4_1));
      remaining_pool_4_2 = setdiff(filtered_no_ban, used_profiles);
      if (remaining_pool_4_2.length === 0) {
        remaining_pool_4_2 = filtered_no_ban;
      }
    }
  } else if (comparisons[3] === "different_position") {
    if (position_candidate_4_1 === "ban") {
      remaining_pool_4_2 = setdiff(no_ban_statements_4_2, used_profiles);
      if (remaining_pool_4_2.length === 0) {
        remaining_pool_4_2 = no_ban_statements; // full set, as fallback
      }
    } else if (position_candidate_4_1 === "no_ban") {
      remaining_pool_4_2 = setdiff(ban_statements_4_2, used_profiles);
      if (remaining_pool_4_2.length === 0) {
        remaining_pool_4_2 = ban_statements_4_2; // fallback
      }
    }
  } else {
    throw new Error("invalid value of comparisons[4]");
  }
  
  // enforce constraint C2 (exclude candidate_3_1, candidate_3_2, candidate_4_1)
  remaining_pool_4_2 = setdiff(remaining_pool_4_2, [candidate_3_1, candidate_3_2, candidate_4_1]);
  
  let candidate_4_2 = remaining_pool_4_2[Math.floor(Math.random() * remaining_pool_4_2.length)];
  used_profiles.push(candidate_4_2);


  
  /////////////////////////////////////////////
  ////////////////// PAIR 5 ///////////////////
  /////////////////////////////////////////////
  
  // Determine which statements are still required (usually 0 or 1 in here)
  let required_statements_after_4 = all_statements.filter(s => !used_profiles.includes(s));
  
  // Check length condition like stopifnot(length(...) %in% c(0, 1, 2))
  if (![0, 1, 2].includes(required_statements_after_4.length)) {
    throw new Error("Unexpected number of required statements after pair 4");
  }
  
  // Find statements that have appeared more than once in used_profiles
  let used_counts = {};
  for (const p of used_profiles) {
    used_counts[p] = (used_counts[p] || 0) + 1;
  }
  let excluded_statements_after_4 = Object.keys(used_counts).filter(s => used_counts[s] > 1);
  
  let remaining_pool_5_1;
  if (required_statements_after_4.length > 0) {
    // Pick one required statement at random
    remaining_pool_5_1 = [sampleOne(required_statements_after_4)];
  } else {
    // For tricky cases, pick from all_statements excluding those excluded or used in pair 4
    remaining_pool_5_1 = all_statements.filter(
      s => !excluded_statements_after_4.includes(s) &&
           s !== candidate_4_1 &&
           s !== candidate_4_2
    );
    // Pick one at random
    remaining_pool_5_1 = [sampleOne(remaining_pool_5_1)];
  }
  let candidate_5_1 = remaining_pool_5_1[0];
  
  let position_candidate_5_1 = report_position(candidate_5_1);
  let frame_candidate_5_1 = candidate_5_1.substring(0, 1);
  
  // Update used profiles
  used_profiles.push(candidate_5_1);
  
  // Update counts again for exclusion
  used_counts = {};
  for (const p of used_profiles) {
    used_counts[p] = (used_counts[p] || 0) + 1;
  }
  let excluded_statements_5_2 = Object.keys(used_counts).filter(s => used_counts[s] > 1);
  
  // Ban and no-ban sets excluding duplicates
  let ban_statements_5_2 = ban_statements.filter(s => !excluded_statements_5_2.includes(s));
  let no_ban_statements_5_2 = no_ban_statements.filter(s => !excluded_statements_5_2.includes(s));
  
  let remaining_pool_5_2;
  
  if (comparisons[4] === "same_position") {
    if (position_candidate_5_1 === "ban") {
      // Filter out statements starting with the same frame as candidate_5_1
      ban_statements_5_2 = ban_statements_5_2.filter(s => !s.startsWith(frame_candidate_5_1));
      remaining_pool_5_2 = ban_statements_5_2.filter(s => !used_profiles.includes(s));
      if (remaining_pool_5_2.length === 0) {
        remaining_pool_5_2 = ban_statements_5_2;
      }
    } else if (position_candidate_5_1 === "no_ban") {
      no_ban_statements_5_2 = no_ban_statements_5_2.filter(s => !s.startsWith(frame_candidate_5_1));
      remaining_pool_5_2 = no_ban_statements_5_2.filter(s => !used_profiles.includes(s));
      if (remaining_pool_5_2.length === 0) {
        remaining_pool_5_2 = no_ban_statements_5_2;
      }
    } else {
      throw new Error("Unexpected position_candidate_5_1 value");
    }
  } else if (comparisons[4] === "different_position") {
    if (position_candidate_5_1 === "ban") {
      remaining_pool_5_2 = no_ban_statements_5_2.filter(s => !used_profiles.includes(s));
      if (remaining_pool_5_2.length === 0) {
        remaining_pool_5_2 = no_ban_statements_5_2;
      }
    } else if (position_candidate_5_1 === "no_ban") {
      remaining_pool_5_2 = ban_statements_5_2.filter(s => !used_profiles.includes(s));
      if (remaining_pool_5_2.length === 0) {
        remaining_pool_5_2 = ban_statements_5_2;
      }
    } else {
      throw new Error("Unexpected position_candidate_5_1 value");
    }
  } else {
    throw new Error("Invalid value of comparisons[4]");
  }
  
  // Enforce constraint C2 by excluding candidate_4_1, candidate_4_2, candidate_5_1
  remaining_pool_5_2 = remaining_pool_5_2.filter(s => s !== candidate_4_1 && s !== candidate_4_2 && s !== candidate_5_1);
  
  // Pick one candidate_5_2 at random from remaining pool
  let candidate_5_2 = sampleOne(remaining_pool_5_2);
  
  // Update used profiles with pair 5 candidates
  used_profiles.push(candidate_5_1, candidate_5_2);
  
  // Handle candidate order reversal if needed
  if (mark_reverse === true) {
    // Store originals
    const orig_candidate_1_1 = candidate_1_1;
    const orig_candidate_1_2 = candidate_1_2;
    const orig_candidate_2_1 = candidate_2_1;
    const orig_candidate_2_2 = candidate_2_2;
    const orig_candidate_3_1 = candidate_3_1;
    const orig_candidate_3_2 = candidate_3_2;
    const orig_candidate_4_1 = candidate_4_1;
    const orig_candidate_4_2 = candidate_4_2;
    const orig_candidate_5_1 = candidate_5_1;
    const orig_candidate_5_2 = candidate_5_2;
  
    // Reassign according to reversal pattern
    candidate_1_1 = orig_candidate_5_1;
    candidate_1_2 = orig_candidate_5_2;
    candidate_2_1 = orig_candidate_4_1;
    candidate_2_2 = orig_candidate_4_2;
    candidate_4_1 = orig_candidate_2_1;
    candidate_4_2 = orig_candidate_2_2;
    candidate_5_1 = orig_candidate_1_1;
    candidate_5_2 = orig_candidate_1_2;
  
    // Restore comparisons from original (assuming orig_comparisons is defined)
    comparisons = [...orig_comparisons];
  }
  // ---

  // Assign parties for all candidate pairs
  let [party_1_1, party_1_2] = assignParties();
  let [party_2_1, party_2_2] = assignParties();
  let [party_3_1, party_3_2] = assignParties();
  let [party_4_1, party_4_2] = assignParties();
  let [party_5_1, party_5_2] = assignParties();
  
	// Store candidates and their party assignments in embedded data
	Qualtrics.SurveyEngine.setEmbeddedData("C1_1", candidate_1_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C1_2", candidate_1_2);
	Qualtrics.SurveyEngine.setEmbeddedData("C1_Party_1", party_1_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C1_Party_2", party_1_2);

	Qualtrics.SurveyEngine.setEmbeddedData("C2_1", candidate_2_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C2_2", candidate_2_2);
	Qualtrics.SurveyEngine.setEmbeddedData("C2_Party_1", party_2_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C2_Party_2", party_2_2);

	Qualtrics.SurveyEngine.setEmbeddedData("C3_1", candidate_3_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C3_2", candidate_3_2);
	Qualtrics.SurveyEngine.setEmbeddedData("C3_Party_1", party_3_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C3_Party_2", party_3_2);

	Qualtrics.SurveyEngine.setEmbeddedData("C4_1", candidate_4_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C4_2", candidate_4_2);
	Qualtrics.SurveyEngine.setEmbeddedData("C4_Party_1", party_4_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C4_Party_2", party_4_2);

	Qualtrics.SurveyEngine.setEmbeddedData("C5_1", candidate_5_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C5_2", candidate_5_2);
	Qualtrics.SurveyEngine.setEmbeddedData("C5_Party_1", party_5_1);
	Qualtrics.SurveyEngine.setEmbeddedData("C5_Party_2", party_5_2);
  
	
	// Get the full text for each candidate pair and store in embedded data
	var full_candidate_1_1 = fullLabel(candidate_1_1);
	var full_candidate_1_2 = fullLabel(candidate_1_2);
	var full_candidate_2_1 = fullLabel(candidate_2_1);
	var full_candidate_2_2 = fullLabel(candidate_2_2);
	var full_candidate_3_1 = fullLabel(candidate_3_1);
	var full_candidate_3_2 = fullLabel(candidate_3_2);
	var full_candidate_4_1 = fullLabel(candidate_4_1);
	var full_candidate_4_2 = fullLabel(candidate_4_2);
	var full_candidate_5_1 = fullLabel(candidate_5_1);
	var full_candidate_5_2 = fullLabel(candidate_5_2);

  // Get the full text for each candidate pair and store in embedded data
  var fullTextC1_1 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_1_1 + "_Text");
  var fullTextC1_2 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_1_2 + "_Text");
  var fullTextC2_1 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_2_1 + "_Text");
  var fullTextC2_2 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_2_2 + "_Text");
  var fullTextC3_1 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_3_1 + "_Text");
  var fullTextC3_2 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_3_2 + "_Text");
  var fullTextC4_1 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_4_1 + "_Text");
  var fullTextC4_2 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_4_2 + "_Text");
  var fullTextC5_1 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_5_1 + "_Text");
  var fullTextC5_2 = Qualtrics.SurveyEngine.getEmbeddedData(full_candidate_5_2 + "_Text");

  // Store the full text in embedded data
  Qualtrics.SurveyEngine.setEmbeddedData("comparison", comparisons); 
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC1_1", fullTextC1_1);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC1_2", fullTextC1_2);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC2_1", fullTextC2_1);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC2_2", fullTextC2_2);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC3_1", fullTextC3_1);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC3_2", fullTextC3_2);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC4_1", fullTextC4_1);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC4_2", fullTextC4_2);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC5_1", fullTextC5_1);
  Qualtrics.SurveyEngine.setEmbeddedData("FullTextC5_2", fullTextC5_2);
  
	// inspect output (using shorthand for positions)
//	console.log(comparisons);
//  console.log('Candidate 1: ', candidate_1_1, candidate_1_2, 'Parties: ', party_1_1, party_1_2);
//  console.log('Candidate 2: ', candidate_2_1, candidate_2_2, 'Parties: ', party_2_1, party_2_2);
//  console.log('Candidate 3: ', candidate_3_1, candidate_3_2, 'Parties: ', party_3_1, party_3_2);
//  console.log('Candidate 4: ', candidate_4_1, candidate_4_2, 'Parties: ', party_4_1, party_4_2);
//  console.log('Candidate 5: ', candidate_5_1, candidate_5_2, 'Parties: ', party_5_1, party_5_2);
});
