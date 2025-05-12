# setup
all_statements <- c("P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B")

# randomize across 5 candidate pairs according to design restrictions
## pair 1
candidate_1_1 <- sample(all_statements, size=1)
if (candidate_1_1 %in% c("P_A", "P_B")) {
 candidate_1_2 <- sample(setdiff(all_statements, c("P_A", "P_B")), size=1)
} else if (candidate_1_1 %in% c("R_A", "R_B")) {
  candidate_1_2 <- sample(setdiff(all_statements, c("R_A", "R_B")), size=1)
} else if (candidate_1_1 %in% c("M_A", "M_B")) {
  candidate_1_2 <- sample(setdiff(all_statements, c("M_A", "M_B")), size=1)
} else if (candidate_1_1 %in% c("T_A", "T_B")) {
  candidate_1_2 <- sample(setdiff(all_statements, c("T_A", "T_B")), size=1)
}
all_statements_updated <- setdiff(all_statements, c(candidate_1_1, candidate_1_2))

## pair 2
candidate_2_1 <- sample(all_statements_updated, size=1)
if (candidate_2_1 %in% c("P_A", "P_B")) {
  candidate_2_2 <- sample(setdiff(all_statements_updated, c("P_A", "P_B")), size=1)
} else if (candidate_2_1 %in% c("R_A", "R_B")) {
  candidate_2_2 <- sample(setdiff(all_statements_updated, c("R_A", "R_B")), size=1)
} else if (candidate_2_1 %in% c("M_A", "M_B")) {
  candidate_2_2 <- sample(setdiff(all_statements_updated, c("M_A", "M_B")), size=1)
} else if (candidate_2_1 %in% c("T_A", "T_B")) {
  candidate_2_2 <- sample(setdiff(all_statements_updated, c("T_A", "T_B")), size=1)
}
all_statements_updated <- setdiff(all_statements_updated, c(candidate_2_1, candidate_2_2))

## pair 3
candidate_3_1 <- sample(all_statements_updated, size=1)
if (candidate_3_1 %in% c("P_A", "P_B")) {
  candidate_3_2 <- sample(setdiff(all_statements_updated, c("P_A", "P_B")), size=1)
} else if (candidate_3_1 %in% c("R_A", "R_B")) {
  candidate_3_2 <- sample(setdiff(all_statements_updated, c("R_A", "R_B")), size=1)
} else if (candidate_3_1 %in% c("M_A", "M_B")) {
  candidate_3_2 <- sample(setdiff(all_statements_updated, c("M_A", "M_B")), size=1)
} else if (candidate_3_1 %in% c("T_A", "T_B")) {
  candidate_3_2 <- sample(setdiff(all_statements_updated, c("T_A", "T_B")), size=1)
}
all_statements_updated <- setdiff(all_statements_updated, c(candidate_3_1, candidate_3_2))
# 
# candidate_1_1 <- "P_A"
# candidate_1_2 <- "R_A"
# candidate_2_1 <- "M_A"
# candidate_2_2 <- "R_B"
# candidate_3_1 <- "P_B"
# candidate_3_2 <- "T_B"
# all_statements_updated <- setdiff(all_statements, c(candidate_1_1, candidate_1_2, 
#                                                     candidate_2_1, candidate_2_2,
#                                                     candidate_3_1, candidate_3_2))

## pair 4 -- all_statements_updated now contains only two statements (from different themes), so the candidate positions can just be taken directly here 
## ** UNLESS BOTH REMAINING STATEMNETS ARE FROM THE SAME THEME, in which case we have to be careful
if (identical(all_statements_updated, c("P_A", "P_B")) | identical(all_statements_updated, c("R_A", "R_B")) | identical(all_statements_updated, c("M_A", "M_B")) | identical(all_statements_updated, c("T_A", "T_B"))) {
  ## set (pair 4 - candidate 1) to be the first element
  candidate_4_1 <- sample(all_statements_updated, size=1)
  ## set (pair 5 - candidate 2) to be the second element. now  we are guaranteed to have allocated all 8 statements across the candidates
  candidate_5_2 <- setdiff(all_statements_updated, candidate_4_1)
  ## now set (pair 4 - candidate 2) to be a random sample of all themes EXCEPT FOR:
  ## (1) for the theme assigned to candidate 4_1
  all_statements_updated_after_4_1 <- setdiff(all_statements, all_statements_updated)
  ## (2) the two statements used in Pair 3 (we would prefer not to have statements repeated in consecutive pairs)
  all_statements_updated_after_4_1 <- setdiff(all_statements_updated_after_4_1, c(candidate_3_1, candidate_3_2))
  candidate_4_2 <- sample(all_statements_updated_after_4_1, size=1)

  ## last, what are the eligible statemnets for (pair 5 - candidate 1)
  ### first, can't be from the same theme as candidate_5_2
  if (candidate_5_2 %in% c("P_A", "P_B")) {
    options_candidate_5_1 <- setdiff(all_statements, c("P_A", "P_B"))
  } else if (candidate_5_2 %in% c("R_A", "R_B")) {
    options_candidate_5_1 <- setdiff(all_statements, c("R_A", "R_B"))
  } else if (candidate_5_2 %in% c("M_A", "M_B")) {
    options_candidate_5_1 <- setdiff(all_statements, c("M_A", "M_B"))
  } else if (candidate_5_2 %in% c("T_A", "T_B")) {
    options_candidate_5_1 <- setdiff(all_statements, c("T_A", "T_B"))
  }
  ## second, it can't be the statement used for (pair 4 - candidate 2), since this has already appeared in TWO comparisons, as opposed to just in one comparison for every other statmenet
  options_candidate_5_1 <- setdiff(options_candidate_5_1, candidate_4_2)
  ## i think that's it
  candidate_5_1 <- sample(options_candidate_5_1, size=1)
} else {
  ## pair 4
  stopifnot(length(all_statements_updated) == 2)
  candidate_4_1 <- all_statements_updated[1]
  candidate_4_2 <- all_statements_updated[2]
  all_statements_updated <- setdiff(all_statements_updated, c(candidate_4_1, candidate_4_2))
  stopifnot(length(all_statements_updated) == 0)

  ## Pair 5 -- same idea as pair 1 since we've now allocated all the needed statements in pairs 1-4
  ## EXCEPT that we also exclude the two statements used in Pair 4 (we would prefer not to have statements repeated in consecutive pairs)
  all_statements_pair_5 <- setdiff(all_statements, c(candidate_4_1, candidate_4_2))
  candidate_5_1 <- sample(all_statements_pair_5, size=1)
  if (candidate_5_1 %in% c("P_A", "P_B")) {
    candidate_5_2 <- sample(setdiff(all_statements_pair_5, c("P_A", "P_B")), size=1)
  } else if (candidate_5_1 %in% c("R_A", "R_B")) {
    candidate_5_2 <- sample(setdiff(all_statements_pair_5, c("R_A", "R_B")), size=1)
  } else if (candidate_5_1 %in% c("M_A", "M_B")) {
    candidate_5_2 <- sample(setdiff(all_statements_pair_5, c("M_A", "M_B")), size=1)
  } else if (candidate_5_1 %in% c("T_A", "T_B")) {
    candidate_5_2 <- sample(setdiff(all_statements_pair_5, c("T_A", "T_B")), size=1)
  }
}

## check that matrix of candidate pairs is equal
mat_candidate_pairs <- matrix(NA, nrow=5, ncol=2)
rownames(mat_candidate_pairs) <- c("Pair 1", "Pair 2", "Pair 3", "Pair 4", "Pair 5")
colnames(mat_candidate_pairs) <- c("Candidate 1", "Candidate 2")
mat_candidate_pairs["Pair 1", "Candidate 1"] <- candidate_1_1
mat_candidate_pairs["Pair 1", "Candidate 2"] <- candidate_1_2
mat_candidate_pairs["Pair 2", "Candidate 1"] <- candidate_2_1
mat_candidate_pairs["Pair 2", "Candidate 2"] <- candidate_2_2
mat_candidate_pairs["Pair 3", "Candidate 1"] <- candidate_3_1
mat_candidate_pairs["Pair 3", "Candidate 2"] <- candidate_3_2
mat_candidate_pairs["Pair 4", "Candidate 1"] <- candidate_4_1
mat_candidate_pairs["Pair 4", "Candidate 2"] <- candidate_4_2
mat_candidate_pairs["Pair 5", "Candidate 1"] <- candidate_5_1
mat_candidate_pairs["Pair 5", "Candidate 2"] <- candidate_5_2

print(mat_candidate_pairs)



## choosing parties
all_parties <- c("Democrat", "Independent", "Republican")
party_1_1 <- sample(all_parties, size=1)
party_1_2 <- sample(setdiff(all_parties, party_1_1), size=1)
