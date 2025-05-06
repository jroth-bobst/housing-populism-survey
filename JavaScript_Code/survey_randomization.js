Qualtrics.SurveyEngine.addOnload(function() {
    let all_statements = ["Populism_A", "Populism_B", "Rights_A", "Rights_B", "Market_A", "Market_B", "Tradeoffs_A", "Tradeoffs_B"];
    let all_parties = ["Democrat", "Independent", "Republican"];

    function sample(statements) {
        return statements[Math.floor(Math.random() * statements.length)];
    }

    function remove(statements, itemsToRemove) {
        return statements.filter(s => !itemsToRemove.includes(s));
    }

    // Function to randomly assign two different parties
    function assignParties() {
        let party_1 = sample(all_parties);
        let party_2 = sample(remove(all_parties, [party_1]));
        return [party_1, party_2];
    }

    // Assign parties for all candidate pairs
    let [party_1_1, party_1_2] = assignParties();
    let [party_2_1, party_2_2] = assignParties();
    let [party_3_1, party_3_2] = assignParties();
    let [party_4_1, party_4_2] = assignParties();
    let [party_5_1, party_5_2] = assignParties();

    // Pair 1
    let candidate_1_1 = sample(all_statements);
    console.log("Pair 1 candidate 1 ", candidate_1_1);
    let candidate_1_2;
    if (["Populism_A", "Populism_B"].includes(candidate_1_1)) {
        console.log("Before removal (Populism theme): ", all_statements);
        const filteredPopulism = remove(all_statements, ["Populism_A", "Populism_B"]);
        console.log("After removal (Populism theme): ", filteredPopulism);
        candidate_1_2 = sample(filteredPopulism);
    } else if (["Rights_A", "Rights_B"].includes(candidate_1_1)) {
        console.log("Before removal (Rights theme): ", all_statements);
        const filteredRights = remove(all_statements, ["Rights_A", "Rights_B"]);
        console.log("After removal (Rights theme): ", filteredRights);
        candidate_1_2 = sample(filteredRights);
    } else if (["Market_A", "Market_B"].includes(candidate_1_1)) {
        console.log("Before removal (Market theme): ", all_statements);
        const filteredMarket = remove(all_statements, ["Market_A", "Market_B"]);
        console.log("After removal (Market theme): ", filteredMarket);
        candidate_1_2 = sample(filteredMarket);
    } else {
        console.log("Before removal (Tradeoffs theme): ", all_statements);
        const filteredTradeoffs = remove(all_statements, ["Tradeoffs_A", "Tradeoffs_B"]);
        console.log("After removal (Tradeoffs theme): ", filteredTradeoffs);
        candidate_1_2 = sample(filteredTradeoffs);
    }
    console.log("Pair 1 candidate 2 ", candidate_1_2);
    all_statements_updated = remove(all_statements, [candidate_1_1, candidate_1_2]);
    console.log("After Pair 1 Removal: ", all_statements_updated);

    // Pair 2
    let candidate_2_1 = sample(all_statements_updated);
    console.log("Pair 2 candidate 1 ", candidate_2_1);
    let candidate_2_2;
    if (["Populism_A", "Populism_B"].includes(candidate_2_1)) {
        console.log("Before removal (Populism theme): ", all_statements_updated);
        const filteredPopulism = remove(all_statements_updated, ["Populism_A", "Populism_B"]);
        console.log("After removal (Populism theme): ", filteredPopulism);
        candidate_2_2 = sample(filteredPopulism);
    } else if (["Rights_A", "Rights_B"].includes(candidate_2_1)) {
        console.log("Before removal (Rights theme): ", all_statements_updated);
        const filteredRights = remove(all_statements_updated, ["Rights_A", "Rights_B"]);
        console.log("After removal (Rights theme): ", filteredRights);
        candidate_2_2 = sample(filteredRights);
    } else if (["Market_A", "Market_B"].includes(candidate_2_1)) {
        console.log("Before removal (Market theme): ", all_statements_updated);
        const filteredMarket = remove(all_statements_updated, ["Market_A", "Market_B"]);
        console.log("After removal (Market theme): ", filteredMarket);
        candidate_2_2 = sample(filteredMarket);
    } else {
        console.log("Before removal (Tradeoffs theme): ", all_statements_updated);
        const filteredTradeoffs = remove(all_statements_updated, ["Tradeoffs_A", "Tradeoffs_B"]);
        console.log("After removal (Tradeoffs theme): ", filteredTradeoffs);
        candidate_2_2 = sample(filteredTradeoffs);
    }
    console.log("Pair 2 candidate 2 ", candidate_2_2);
    all_statements_updated = remove(all_statements_updated, [candidate_2_1, candidate_2_2]);
    console.log("After Pair 2 Removal: ", all_statements_updated);

    // Pair 3
    let candidate_3_1 = sample(all_statements_updated);
    console.log("Pair 3 candidate 1 ", candidate_3_1);
    let candidate_3_2;
    if (["Populism_A", "Populism_B"].includes(candidate_3_1)) {
        console.log("Before removal (Populism theme): ", all_statements_updated);
        const filteredPopulism = remove(all_statements_updated, ["Populism_A", "Populism_B"]);
        console.log("After removal (Populism theme): ", filteredPopulism);
        candidate_3_2 = sample(filteredPopulism);
    } else if (["Rights_A", "Rights_B"].includes(candidate_3_1)) {
        console.log("Before removal (Rights theme): ", all_statements_updated);
        const filteredRights = remove(all_statements_updated, ["Rights_A", "Rights_B"]);
        console.log("After removal (Rights theme): ", filteredRights);
        candidate_3_2 = sample(filteredRights);
    } else if (["Market_A", "Market_B"].includes(candidate_3_1)) {
        console.log("Before removal (Market theme): ", all_statements_updated);
        const filteredMarket = remove(all_statements_updated, ["Market_A", "Market_B"]);
        console.log("After removal (Market theme): ", filteredMarket);
        candidate_3_2 = sample(filteredMarket);
    } else {
        console.log("Before removal (Tradeoffs theme): ", all_statements_updated);
        const filteredTradeoffs = remove(all_statements_updated, ["Tradeoffs_A", "Tradeoffs_B"]);
        console.log("After removal (Tradeoffs theme): ", filteredTradeoffs);
        candidate_3_2 = sample(filteredTradeoffs);
    }
    console.log("Pair 3 candidate 2 ", candidate_3_2);
    all_statements_updated = remove(all_statements_updated, [candidate_3_1, candidate_3_2]);
    console.log("After Pair 3 Removal: ", all_statements_updated);

    // Pair 4 -- all_statements_updated now contains only two statements (from different themes),
// so the candidate positions can just be taken directly here 
// ** UNLESS BOTH REMAINING STATEMENTS ARE FROM THE SAME THEME, in which case we have to be careful
if (
    JSON.stringify(all_statements_updated) === JSON.stringify(["Populism_A", "Populism_B"]) ||
    JSON.stringify(all_statements_updated) === JSON.stringify(["Rights_A", "Rights_B"]) ||
    JSON.stringify(all_statements_updated) === JSON.stringify(["Market_A", "Market_B"]) ||
    JSON.stringify(all_statements_updated) === JSON.stringify(["Tradeoffs_A", "Tradeoffs_B"])
) {
    // set (pair 4 - candidate 1) to be the first element
    candidate_4_1 = sample(all_statements_updated);
    console.log("Pair 4 candidate 1 ", candidate_4_1);
    // set (pair 5 - candidate 2) to be the second element. now  we are guaranteed to have allocated all 8 statements across the candidates
    candidate_5_2 = remove(all_statements_updated, [candidate_4_1])[0];
    console.log("Pair 5 candidate 2 ", candidate_5_2);
    // now set (pair 4 - candidate 2) to be a random sample of all themes EXCEPT for
    /// (1) the theme assigned to candidate_4_1
    all_statements_updated_after_4_1 = remove(all_statements, all_statements_updated);
    console.log("After Pair 4_1 Removal: ", all_statements_updated_after_4_1);
    /// (2) the two statements used in Pair 3 (we would prefer not to have statements repeated in consecutive pairs)
    all_statements_updated_after_4_1 = remove(all_statements_updated_after_4_1, [candidate_3_1, candidate_3_2]);
    console.log("After Pair 3 Removal: ", all_statements_updated_after_4_1);
    candidate_4_2 = sample(all_statements_updated_after_4_1);
    console.log("Pair 4 candidate 2 ", candidate_4_2);
    
    // last, what are the eligible statements for (pair 5 - candidate 1)?
    // first, it can't be from the same theme as candidate_5_2
    if (["Populism_A", "Populism_B"].includes(candidate_5_2)) {
        options_candidate_5_1 = remove(all_statements, ["Populism_A", "Populism_B"]);
    } else if (["Rights_A", "Rights_B"].includes(candidate_5_2)) {
        options_candidate_5_1 = remove(all_statements, ["Rights_A", "Rights_B"]);
    } else if (["Market_A", "Market_B"].includes(candidate_5_2)) {
        options_candidate_5_1 = remove(all_statements, ["Market_A", "Market_B"]);
    } else if (["Tradeoffs_A", "Tradeoffs_B"].includes(candidate_5_2)) {
        options_candidate_5_1 = remove(all_statements, ["Tradeoffs_A", "Tradeoffs_B"]);
    }
    // second, it can't be the statement used for (pair 4 - candidate 1)
    options_candidate_5_1 = remove(options_candidate_5_1, [candidate_4_2]);
    console.log("After 5_2 theme and 4_1 question Removal: ", options_candidate_5_1);
    // i think that's it -- now we can sample candidate_5_1 from the eligible options
    candidate_5_1 = sample(options_candidate_5_1);
    console.log("Pair 5 candidate 1 ", candidate_5_1);
} else {
    console.log("here? else")
    candidate_4_1 = all_statements_updated[0];
    candidate_4_2 = all_statements_updated[1];
    console.log("Pair 4 candidate 1 ", candidate_4_1);
    console.log("Pair 4 candidate 2 ", candidate_4_2);
    all_statements_updated = remove(all_statements_updated, [candidate_4_1, candidate_4_2]);
    console.log("After Pair 4 Removal: ", all_statements_updated);

    // Pair 5 -- same idea as pair 1 since we've now allocated all the needed statements in pairs 1-4
    // EXCEPT that we also exclude the two statements used in Pair 4 (we would prefer not to have statements repeated in consecutive pairs)
    all_statements_pair_5 = remove(all_statements, [candidate_4_1, candidate_4_2]);
    candidate_5_1 = sample(all_statements_pair_5);
    console.log("Pair 5 candidate 1 ", candidate_5_1);    
    if (["Populism_A", "Populism_B"].includes(candidate_5_1)) {
        candidate_5_2 = sample(remove(all_statements_pair_5, ["Populism_A", "Populism_B"]));
    } else if (["Rights_A", "Rights_B"].includes(candidate_5_1)) {
        candidate_5_2 = sample(remove(all_statements_pair_5, ["Rights_A", "Rights_B"]));
    } else if (["Market_A", "Market_B"].includes(candidate_5_1)) {
        candidate_5_2 = sample(remove(all_statements_pair_5, ["Market_A", "Market_B"]));
    } else {
        candidate_5_2 = sample(remove(all_statements_pair_5, ["Tradeoffs_A", "Tradeoffs_B"]));
    }
    console.log("Pair 5 candidate 2 ", candidate_5_2);
}

  console.log("Before accessing candidate_5_2: ", candidate_5_2);
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

    // Log candidates and their party assignments to see what's being set
    console.log('Candidate 1: ', candidate_1_1, candidate_1_2, 'Parties: ', party_1_1, party_1_2);
    console.log('Candidate 2: ', candidate_2_1, candidate_2_2, 'Parties: ', party_2_1, party_2_2);
    console.log('Candidate 3: ', candidate_3_1, candidate_3_2, 'Parties: ', party_3_1, party_3_2);
    console.log('Candidate 4: ', candidate_4_1, candidate_4_2, 'Parties: ', party_4_1, party_4_2);
   console.log('Candidate 5: ', candidate_5_1, candidate_5_2, 'Parties: ', party_5_1, party_5_2);

    // Get the full text for each candidate pair and store in embedded data
    var fullTextC1_1 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_1_1 + "_Text");
    var fullTextC1_2 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_1_2 + "_Text");
    var fullTextC2_1 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_2_1 + "_Text");
    var fullTextC2_2 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_2_2 + "_Text");
    var fullTextC3_1 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_3_1 + "_Text");
    var fullTextC3_2 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_3_2 + "_Text");
    var fullTextC4_1 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_4_1 + "_Text");
    var fullTextC4_2 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_4_2 + "_Text");
    var fullTextC5_1 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_5_1 + "_Text");
    var fullTextC5_2 = Qualtrics.SurveyEngine.getEmbeddedData(candidate_5_2 + "_Text");

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

    // Log full text to verify
///    console.log('Full Text Candidate 1: ', fullTextC1_1, fullTextC1_2);
///    console.log('Full Text Candidate 2: ', fullTextC2_1, fullTextC2_2);
///    console.log('Full Text Candidate 3: ', fullTextC3_1, fullTextC3_2);
///    console.log('Full Text Candidate 4: ', fullTextC4_1, fullTextC4_2);
///    console.log('Full Text Candidate 5: ', fullTextC5_1, fullTextC5_2);
});