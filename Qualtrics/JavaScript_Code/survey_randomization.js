Qualtrics.SurveyEngine.addOnload(function() {
    // Log to indicate the script is starting
    console.log("Starting script...");
    console.log("Using updated version of the script.");
	
	// Initialize indicator of whether we are reversing the comparison order (for the five scenarios starting with different/different, it was easier to code the constraints for the reverse scenario (i.e. ending with different/different))
	let mark_reverse = false;

    // Helper functions
    function sample(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

	function remove(arr, itemsToRemove) {
		// Remove duplicates from itemsToRemove
		let uniqueItemsToRemove = [...new Set(itemsToRemove)];

		// Filter out only the items that are in the uniqueItemsToRemove list
		return arr.filter(x => !uniqueItemsToRemove.includes(x));
	}

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
	function intersect(arr1, arr2) {
  		return arr1.filter(item => arr2.includes(item));
	}
	function substr(str, start, end) {
  		return str.substring(start, end); // Correctly uses substring on string elements
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


    // Assign comparisons: 2 or 3 "same", rest "different"
    let n_same = Math.random() < 0.5 ? 2 : 3;
    let n_different = 5 - n_same;
    let comparisons = shuffle(
        Array(n_same).fill("same").concat(Array(n_different).fill("different"))
    );

    // Log comparisons to check the assignment
    console.log("Comparisons:", comparisons);
	
	// for the five scenarios starting with different/different, it was easier to code the constraints for the reverse scenario (i.e. ending with different/different)
	// so we can just reverse the comparison order, run the code we have, then reverse the pairs at the end. it should still be stored under name_one_combination, though, so we do the change after defining name_one_combination
	let orig_comparisons;
	if (comparisons[0] === "different" && comparisons[1] === "different") {
	  mark_reverse = true;
	  console.log("reversing order of comparisons vector");
	  orig_comparisons = [...comparisons]; // save original
	  comparisons = [...comparisons].reverse();
	}

    // Define all possible statements (for this example)
    let all_statements = ["P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B"];

    // Log all_statements to check its content
    console.log("All Statements:", all_statements);

    // Function to extract the prefix from a statement (P, R, M, T)
    function getPrefix(profile) {
        return profile.split("_")[0]; // e.g., "P" from "P_A"
    }

    // Function to extract the suffix (A, B)
    function getSuffix(profile) {
        return profile.split("_")[1]; // e.g., "A" from "P_A"
    }

    // Initialize used profiles list
    let used_profiles = [];

    // ** Pair 1 Logic **

    // Step 1: Choose candidate 1 for Pair 1
    let candidate_1_1 = sample(all_statements);

    // Log candidate_1_1 to verify it's being selected correctly
    console.log("Candidate 1_1:", candidate_1_1);

    // Step 2: If comparison is "same", choose the counterpart from the same party but different suffix
    let candidate_1_2; // Declare candidate_1_2 here to ensure it's defined before use

    if (comparisons[0] === "same") {
        let prefix = getPrefix(candidate_1_1);
        let suffix = getSuffix(candidate_1_1);
        let opposite_suffix = suffix === "A" ? "B" : "A";  // Flip the suffix

        // Construct candidate_1_2 by switching the suffix
        candidate_1_2 = prefix + "_" + opposite_suffix;

        // Ensure the selected candidate is not already used
        if (used_profiles.includes(candidate_1_2)) {
            candidate_1_2 = prefix + "_" + (opposite_suffix === "A" ? "B" : "A");
        }

        // Log candidate_1_2 for debugging
        console.log("Candidate 1_2 (same):", candidate_1_2);

        // Add to used profiles
        used_profiles.push(candidate_1_1, candidate_1_2);
    } else { // If comparison is "different", select from remaining statements excluding the same prefix
        let prefix_1 = getPrefix(candidate_1_1);
        let remaining_options = remove(all_statements.filter(x => getPrefix(x) !== prefix_1), used_profiles);
        candidate_1_2 = sample(remaining_options);

        // Log candidate_1_2 for debugging
        console.log("Candidate 1_2 (different):", candidate_1_2);

        // Add to used profiles
        used_profiles.push(candidate_1_1, candidate_1_2);
    }
	
	// ** Pair 2 Logic **
    let remaining_pool = remove(all_statements, used_profiles);  // Remove used profiles from the pool

    let candidate_2_1, candidate_2_2;

    if (comparisons[1] === "same") {
        // Eliminate the prefixes used in previous pair (Pair 1)
        let prev_prefixes = [getPrefix(candidate_1_1), getPrefix(candidate_1_2)];
        
        // Remove prefixes used in Pair 1
        let available_prefixes = remove(["P", "R", "M", "T"], prev_prefixes);

        // Randomly choose one of the remaining prefixes for the same-position pair
        let chosen_prefix = sample(available_prefixes);
        candidate_2_1 = chosen_prefix + "_A";
        candidate_2_2 = chosen_prefix + "_B";

        console.log("Candidate 2_1 and Candidate 2_2 (same):", candidate_2_1, candidate_2_2);
        used_profiles.push(candidate_2_1, candidate_2_2);
    } else {
        // If comparison is "different", choose randomly from remaining pool
        candidate_2_1 = sample(remaining_pool);
        let prefix_2 = getPrefix(candidate_2_1);

        // Ensure candidate 2_2 does not have the same prefix as candidate 2_1
        let remaining_options = remove(remaining_pool.filter(x => getPrefix(x) !== prefix_2), candidate_2_1);
        candidate_2_2 = sample(remaining_options);

        console.log("Candidate 2_1 and Candidate 2_2 (different):", candidate_2_1, candidate_2_2);
        used_profiles.push(candidate_2_1, candidate_2_2);
    }
	
	
	
	// ** Pair 3 Logic **
    // Remaining pool is updated after Pair 1 and Pair 2
    remaining_pool = remove(all_statements, used_profiles);

    let candidate_3_1, candidate_3_2;

    if (comparisons[2] === "same") {
        // Get the prefixes from Pair 2 (candidate_2_1, candidate_2_2)
        let prev_prefixes = [getPrefix(candidate_2_1), getPrefix(candidate_2_2)];
        
        // Check if either Pair 1 or Pair 2 was "same" and adjust the prefix elimination accordingly
        if (comparisons[0] === "same" || comparisons[1] === "same") {
            prev_prefixes = used_profiles.map(profile => getPrefix(profile));  // Eliminate from all previous profiles if any pair was "same"
        }

        // Eliminate prefixes that have already been used
        let available_prefixes = remove(["P", "R", "M", "T"], prev_prefixes);

        // Randomly select a prefix for the "same" pair
        let chosen_prefix = sample(available_prefixes);
        candidate_3_1 = chosen_prefix + "_A";
        candidate_3_2 = chosen_prefix + "_B";

        console.log("Candidate 3_1 and Candidate 3_2 (same):", candidate_3_1, candidate_3_2);
        used_profiles.push(candidate_3_1, candidate_3_2);
    } else {
        // If comparison is "different", choose profiles from the remaining pool
        candidate_3_1 = sample(remaining_pool);
        let prefix_3 = getPrefix(candidate_3_1);

        // Ensure candidate 3_2 does not have the same prefix as candidate 3_1
        let remaining_options = remove(remaining_pool.filter(x => getPrefix(x) !== prefix_3), candidate_3_1);
        candidate_3_2 = sample(remaining_options);

        console.log("Candidate 3_1 and Candidate 3_2 (different):", candidate_3_1, candidate_3_2);
        used_profiles.push(candidate_3_1, candidate_3_2);
    }
	
	// Pair 4 logic
	console.log("Starting Pair 4...");

	let required_statements = remove(all_statements, used_profiles);
	let profile_counts = used_profiles.reduce((acc, curr) => {
	  acc[curr] = (acc[curr] || 0) + 1;
	  return acc;
	}, {});

	let used_more_than_once = Object.keys(profile_counts).filter(profile => profile_counts[profile] > 1);
	let available_statements = remove(all_statements, used_more_than_once);

	// Also avoid repeating pair 3 profiles
	available_statements = remove(available_statements, [candidate_3_1, candidate_3_2]);

	if (comparisons[3] == "same") {
	  // only keep prefixes that appear twice (to allow both A and B)
	  let available_prefixes = available_statements.map(item => substr(item, 0, 1));
	  available_prefixes = Object.keys(
		available_prefixes.reduce((acc, prefix) => {
		  acc[prefix] = (acc[prefix] || 0) + 1;
		  return acc;
		}, {})
	  ).filter(prefix => available_prefixes.filter(p => p === prefix).length > 1);

	  // Filter to required prefixes if any required statements are left AND those prefixes were not used in the previous pair
	  let required_prefixes = required_statements.map(item => substr(item, 0, 1));
	  let prev_prefixes = [candidate_3_1, candidate_3_2].map(item => substr(item, 0, 1));
	  let updated_required_prefixes = remove(required_prefixes, prev_prefixes);

	  if (updated_required_prefixes.length > 0) {
		available_prefixes = available_prefixes.filter(prefix =>
		  updated_required_prefixes.includes(prefix)
		);
	  }

	  let chosen_prefix = sample(available_prefixes);
	  let chosen_statements = [chosen_prefix + "_A", chosen_prefix + "_B"];
	  candidate_4_1 = chosen_statements[0];
	  candidate_4_2 = chosen_statements[1];

	  console.log("Candidate 4 (same):", candidate_4_1, candidate_4_2);
	} else {
	  let pool = intersect(required_statements, available_statements);

	  if (comparisons[4] == "same") {
		let pool_prefixes = pool.map(item => substr(item, 0, 1));
		let prefix_pairs = Object.keys(pool_prefixes).filter(prefix =>
		  pool_prefixes.filter(p => p === prefix).length > 1
		);
		let eliminate_statements = prefix_pairs.flatMap(prefix =>
		  [prefix + "_A", prefix + "_B"]
		);
		pool = remove(pool, eliminate_statements);
		available_statements = remove(available_statements, eliminate_statements);
	  }

	  if (pool.length > 0) {
		candidate_4_1 = sample(pool);
	  } else {
		candidate_4_1 = sample(available_statements);
	  }

	  let prefix_4 = substr(candidate_4_1, 0, 1);
	  let remaining_options = remove(
		available_statements.filter(item => substr(item, 0, 1) !== prefix_4),
		[candidate_4_1]
	  );

	  let pool2 = intersect(remaining_options, required_statements);

	  if (comparisons[4] == "same") {
		let pool2_prefixes = pool2.map(item => substr(item, 0, 1));
		let prefix_pairs = Object.keys(pool2_prefixes).filter(prefix =>
		  pool2_prefixes.filter(p => p === prefix).length > 1
		);
		let eliminate_statements = prefix_pairs.flatMap(prefix =>
		  [prefix + "_A", prefix + "_B"]
		);
		pool2 = remove(pool2, eliminate_statements);
		remaining_options = remove(remaining_options, eliminate_statements);
	  }

	  if (pool2.length > 0) {
		candidate_4_2 = sample(pool2);
	  } else {
		candidate_4_2 = sample(remaining_options);
	  }

	  console.log("Candidate 4 (different):", candidate_4_1, candidate_4_2);
	}
	
	used_profiles = used_profiles.concat([candidate_4_1, candidate_4_2]);
	
	// Pair 5
	
	try {
		console.log("Starting Pair 5...");

		// Determine which statements are still required (i.e., have not yet appeared)
		let required_statements = all_statements.filter(statement => !used_profiles.includes(statement));
		console.log("Required statements:", required_statements);

		// Eliminate any that have been used twice already
		let available_statements = all_statements.filter(statement => {
			return used_profiles.filter(x => x === statement).length <= 1;
		});
		console.log("Available statements:", available_statements);

		// Also avoid repeating pair 4 profiles
		available_statements = available_statements.filter(statement => ![candidate_4_1, candidate_4_2].includes(statement));
		console.log("Available statements after removing pair 4 profiles:", available_statements);

		if (comparisons[4] === "same") {
			console.log("Comparisons[4] is 'same', filtering available prefixes...");

			// Only keep prefixes that appear twice (to allow both A and B)
			let available_prefixes = available_statements.map(statement => statement.substr(0, 1));
			console.log("Available prefixes:", available_prefixes);

			available_prefixes = available_prefixes.filter((value, index, self) => self.indexOf(value) !== index);
			console.log("Filtered available prefixes:", available_prefixes);

			// Filter to required prefixes if any required statements are left
			if (required_statements.length > 0) {
				let required_prefixes = required_statements.map(statement => statement.substr(0, 1));
				available_prefixes = available_prefixes.filter(prefix => required_prefixes.includes(prefix));
				console.log("Available prefixes after filtering with required prefixes:", available_prefixes);
			}

			// Choose a random prefix
			let chosen_prefix = available_prefixes[Math.floor(Math.random() * available_prefixes.length)];
			console.log("Chosen prefix:", chosen_prefix);

			let chosen_statements = [
				chosen_prefix + "_A", 
				chosen_prefix + "_B"
			];
			console.log("Chosen statements:", chosen_statements);

			candidate_5_1 = chosen_statements[0];
			candidate_5_2 = chosen_statements[1];
			console.log("Chosen candidate_5_1:", candidate_5_1);
			console.log("Chosen candidate_5_2:", candidate_5_2);

		} else {
			console.log("Comparisons[4] is not 'same', selecting from available statements...");

			// Ensure we include any required statements if available
			let pool = required_statements.filter(statement => available_statements.includes(statement));
			console.log("Pool of required statements:", pool);

			if (pool.length > 0) {
				candidate_5_1 = pool[Math.floor(Math.random() * pool.length)];
			} else {
				candidate_5_1 = available_statements[Math.floor(Math.random() * available_statements.length)];
			}
			console.log("Chosen candidate_5_1:", candidate_5_1);

			let prefix_5 = candidate_5_1.substr(0, 1);
			let remaining_options = available_statements.filter(statement => statement.substr(0, 1) !== prefix_5 && statement !== candidate_5_1);
			console.log("Remaining options for candidate_5_2:", remaining_options);

			// Select from required statements if applicable
			let pool2 = remaining_options.filter(statement => required_statements.includes(statement));
			console.log("Pool of required statements for candidate_5_2:", pool2);

			if (pool2.length > 0) {
				candidate_5_2 = pool2[Math.floor(Math.random() * pool2.length)];
			} else {
				candidate_5_2 = remaining_options[Math.floor(Math.random() * remaining_options.length)];
			}
			console.log("Chosen candidate_5_2:", candidate_5_2);
		}

		// Update used profiles
		used_profiles = used_profiles.concat([candidate_5_1, candidate_5_2]);
		console.log("Updated used profiles:", used_profiles);

	} catch (error) {
		console.log("did we get here?")
		console.error("Error in Pair 5 logic:", error);
		 console.trace();  
		throw error;
	}
	
	 // reversing candidate order in scenarios that started with different/different/*
	if (mark_reverse) {
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

	  candidate_1_1 = orig_candidate_5_1;
	  candidate_1_2 = orig_candidate_5_2;
	  candidate_2_1 = orig_candidate_4_1;
	  candidate_2_2 = orig_candidate_4_2;
	  candidate_3_1 = orig_candidate_3_1; 
	  candidate_3_2 = orig_candidate_3_2; 
	  candidate_4_1 = orig_candidate_2_1;
	  candidate_4_2 = orig_candidate_2_2;
	  candidate_5_1 = orig_candidate_1_1;
	  candidate_5_2 = orig_candidate_1_2;
	  
	  comparisons = orig_comparisons;
	}

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
	console.log(comparisons);
  console.log('Candidate 1: ', candidate_1_1, candidate_1_2, 'Parties: ', party_1_1, party_1_2);
  console.log('Candidate 2: ', candidate_2_1, candidate_2_2, 'Parties: ', party_2_1, party_2_2);
  console.log('Candidate 3: ', candidate_3_1, candidate_3_2, 'Parties: ', party_3_1, party_3_2);
  console.log('Candidate 4: ', candidate_4_1, candidate_4_2, 'Parties: ', party_4_1, party_4_2);
  console.log('Candidate 5: ', candidate_5_1, candidate_5_2, 'Parties: ', party_5_1, party_5_2);
  
  console.log("Done with script")
	
});