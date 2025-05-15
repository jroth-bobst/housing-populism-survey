# 05/12/2025: in format to convert to JavaScript
#rm(list=ls())

## setup
running_separately <- TRUE

# CONSTRAINTS
## C1: A respondent must see each of the profiles at least once (but not more than twice).
## C2: A respondent cannot see the same profile in consecutive tasks (e.g. if they see P_A in task 1 they can’t also see P_A in task 2)
## C3: Two or three of the tasks must feature candidates with the same policy position, but with different frames. For example, P_A vs R_A is a valid comparison (both in the “ban” position but with different “frames” P and R), but M_A vs. M_B is NOT a valid comparison (although both have the same “no ban” position, they have the same “frame” 
## C4: Two or three of the tasks must feature candidates with different policy positions. For example, P_B vs. M_A would be a valid comparison because the first candidate has the “ban” position and the second has the “no ban” position

# all candidate profiles
all_statements <- c("P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B")
ban_statements <- c("P_A", "P_B", "R_A", "R_B")
no_ban_statements <- c("M_A", "M_B", "T_A", "T_B")

# initialize indicator of whether we are reversing the comparison order (for the scenario d/d/s/s/d it was easier to code the constraints for the reverse scenario (i.e. ending with d/d))
mark_reverse <- FALSE

# for the five scenarios starting with different/different, it was easier to code the constraints for the reverse scenario (i.e. ending with different/different)
# so we can just reverse the comparison order, run the code we have, then reverse the pairs at the end. it should still be stored under name_one_combination, though, so we do the change after defining name_one_combination
if (identical(comparisons, c("different_position", "different_position", "same_position", "same_position", "different_position"))) {
  mark_reverse <- TRUE
#  print(paste("reversing order of comparisons vector for scenario:", paste(comparisons, collapse=", ")))
  orig_comparisons <- comparisons
  comparisons <- rev(comparisons)
}

# get random sample of same/different positions
if (running_separately == FALSE) {
  n_pairs <- 5
  n_same <- sample(x=2:3, size=1)
  n_different <- n_pairs - n_same
  
  comparisons <- sample(c(rep("same_position", times=n_same), 
                        rep("different_position", times=n_different)),
                        size=5,
                        replace=FALSE)
  print(comparisons)
}


## check that matrix of candidate pairs makes sense
mat_candidate_pairs <- matrix(NA, nrow=5, ncol=2)
rownames(mat_candidate_pairs) <- c("Pair 1", "Pair 2", "Pair 3", "Pair 4", "Pair 5")
colnames(mat_candidate_pairs) <- c("Candidate 1", "Candidate 2")

# keep track of used profiles
used_profiles <- character(0)

# helper functions
report_position <- function(x) {
 if (x %in% c("P_A", "P_B", "R_A", "R_B")) {
  cand_position <- "ban" 
 } else if (x %in% c("M_A", "M_B", "T_A", "T_B")) {
  cand_position <- "no_ban" 
 } else {
   stop("invalid position specified")
 } 
  return(cand_position)
}

########################
######## Pair 1 ########
########################
candidate_1_1 <- sample(all_statements, 1)
position_candidate_1_1 <- report_position(candidate_1_1)
frame_candidate_1_1 <- substr(candidate_1_1, 1, 1)
if (comparisons[1] == "same_position") {
  if (position_candidate_1_1 == "ban") {
    remaining_options <- ban_statements[!str_starts(ban_statements, frame_candidate_1_1)]
  } else if (position_candidate_1_1 == "no_ban") {
    remaining_options <- no_ban_statements[!str_starts(no_ban_statements, frame_candidate_1_1)]
  }
} else if (comparisons[1] == "different_position") {
  if (position_candidate_1_1 == "ban") {
    remaining_options <- no_ban_statements
  } else if (position_candidate_1_1 == "no_ban") {
    remaining_options <- ban_statements
  }
} else {
  stop("invalid value of comparisons")
}
candidate_1_2 <- sample(remaining_options, 1)
used_profiles <- c(used_profiles, candidate_1_1, candidate_1_2)
if (running_separately == FALSE) {
 print(paste0("Pair 1 comparison: ", comparisons[1]))
 print(paste0("candidate_1_1: ", candidate_1_1))
 print(paste0("candidate_1_2: ", candidate_1_2))
}

########################
######## Pair 2 ########
########################
remaining_pool_2_1 <- setdiff(all_statements, used_profiles)
## choose a frame that hasn't been chosen yet (helps avoid violating constraints in later pairs)
excluded_start_2_1 <- substr(used_profiles, 1, 1)
remaining_pool_2_1 <- all_statements[!substr(all_statements, 1, 1) %in% excluded_start_2_1] 
candidate_2_1 <- sample(remaining_pool_2_1, 1) 
position_candidate_2_1 <- report_position(candidate_2_1)
frame_candidate_2_1 <- substr(candidate_2_1, 1, 1)
ban_statements_2_2 <- ban_statements[!str_starts(ban_statements, frame_candidate_2_1)] ## remember this also excludes candidate_3_1 statement
no_ban_statements_2_2 <- no_ban_statements[!str_starts(no_ban_statements, frame_candidate_2_1)] ## remember this also excludes candidate_3_1 statement
if (comparisons[2] == "same_position") {
  if (position_candidate_2_1 == "ban") {
    remaining_pool_2_2 <- ban_statements_2_2
  } else if (position_candidate_2_1 == "no_ban") {
    remaining_pool_2_2 <- no_ban_statements_2_2
  }
} else if (comparisons[2] == "different_position") {
  if (position_candidate_2_1 == "ban") {
    remaining_pool_2_2 <- setdiff(no_ban_statements, candidate_2_1)
  } else if (position_candidate_2_1 == "no_ban") {
    remaining_pool_2_2 <- setdiff(ban_statements, candidate_2_1)
  }
} else {
  stop("invalid value of comparisons")
}
remaining_pool_2_2 <- setdiff(remaining_pool_2_2, c(candidate_1_1, candidate_1_2, candidate_2_1)) ## essential to enforce constraint C2
candidate_2_2 <- sample(remaining_pool_2_2, 1)

used_profiles <- c(used_profiles, candidate_2_1, candidate_2_2)
if (running_separately == FALSE) {
print(paste0("Pair 2 comparison: ", comparisons[2]))
print(paste0("candidate_2_1: ", candidate_2_1))
print(paste0("candidate_2_2: ", candidate_2_2))
}

########################
######## Pair 3 ########
########################
remaining_pool_3_1 <- setdiff(all_statements, used_profiles)
remaining_frames_3_1 <- substr(remaining_pool_3_1, 1, 1)
remaining_frames_with_both_3_1 <- names(table(remaining_frames_3_1)[table(remaining_frames_3_1) > 1]) ## if any 2 of the unused statements have the same frame, require pulling one of that frame first (avoids contradicting the constraints in Pairs 4 and 5 later)
if (length(remaining_frames_with_both_3_1) > 0) {
  remaining_pool_3_1 <- remaining_pool_3_1[substr(remaining_pool_3_1, 1, 1) %in% remaining_frames_with_both_3_1]
} 
candidate_3_1 <- sample(remaining_pool_3_1, 1)
position_candidate_3_1 <- report_position(candidate_3_1)
frame_candidate_3_1 <- substr(candidate_3_1, 1, 1)
if (comparisons[3] == "same_position") {
  if (position_candidate_3_1 == "ban") {
    ban_statements_3_2 <- ban_statements[!str_starts(ban_statements, frame_candidate_3_1)] ## remember this also excludes candidate_3_1 statement
    remaining_pool_3_2 <- setdiff(ban_statements_3_2, used_profiles)
    if (length(remaining_pool_3_2) == 0) {
      remaining_pool_3_2 <- ban_statements_3_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_3_1 because that is will be the opposite position from the vector here)
    }
  } else if (position_candidate_3_1 == "no_ban") {
    no_ban_statements_3_2 <- no_ban_statements[!str_starts(no_ban_statements, frame_candidate_3_1)]
    remaining_pool_3_2 <- setdiff(no_ban_statements_3_2, used_profiles)
    if (length(remaining_pool_3_2) == 0) {
      remaining_pool_3_2 <- no_ban_statements_3_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_3_1 because that is will be the opposite position from the vector here)
    }
  }
} else if (comparisons[3] == "different_position") {
  if (position_candidate_3_1 == "ban") {
    remaining_pool_3_2 <- setdiff(no_ban_statements, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_3_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_3_2) == 0) {
      remaining_pool_3_2 <- no_ban_statements ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full no_ban_statements and will enforce C2 just below)
    }
  } else if (position_candidate_3_1 == "no_ban") {
    remaining_pool_3_2 <- setdiff(ban_statements, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_3_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_3_2) == 0) {
      remaining_pool_3_2 <- ban_statements  ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full ban_statements and will enforce C2 just below)
    }
  }
} else {
  stop("invalid value of comparisons")
}
remaining_pool_3_2 <- setdiff(remaining_pool_3_2, c(candidate_2_1, candidate_2_2, candidate_3_1)) ## essential to enforce constraint C2
candidate_3_2 <- sample(remaining_pool_3_2, 1)

used_profiles <- c(used_profiles, candidate_3_1, candidate_3_2)
if (running_separately == FALSE) {
  print(paste0("Pair 3 comparison: ", comparisons[3]))
  print(paste0("candidate_3_1: ", candidate_3_1))
  print(paste0("candidate_3_2: ", candidate_3_2))
  
  mat_pairs <- rbind(c(candidate_1_1, candidate_1_2),
                     c(candidate_2_1, candidate_2_2),
                     c(candidate_3_1, candidate_3_2))
  rownames(mat_pairs) <- c("Pair 1", "Pair 2", "Pair 3")
  colnames(mat_pairs) <- c("Candidate_1", "Candidate_2")
  print(comparisons)
  print(mat_pairs)
  table(mat_pairs)
}


########################
######## Pair 4 ########
########################
# determine which statements are still required (i.e., have not yet appeared) -- there must be at least two in here
required_statements_after_3 <- setdiff(all_statements, used_profiles)
## check if any two required statements have the same prefix (frame). if so, one of these MUST be chosen for Pair 4. Otherwise, Pair 5 would be required to use the invalid comparison of two statements with the same frame.
required_frames_after_3 <- substr(required_statements_after_3, 1, 1)
required_frame_4_1 <- names(table(required_frames_after_3)[table(required_frames_after_3) > 1])
stopifnot(length(required_frame_4_1) %in% c(0, 1))
if (length(required_frame_4_1) > 0) {
  required_statements_4_1 <- required_statements_after_3[substr(required_statements_after_3, 1, 1) %in% required_frame_4_1]
  candidate_4_1 <- sample(required_statements_4_1, 1)
} else {
  ## this may not work as as -- for some tricky cases we may have to assign pair 4 and pair 5 jointly. but just to get it going...
#  print("for some tricky cases, will need to do this randomization jointly with pair 5 (e.g. send a required statement to pair 5 and use a repeat in pair 4")
  candidate_4_1 <- sample(required_statements_after_3, 1)
}
position_candidate_4_1 <- report_position(candidate_4_1)
frame_candidate_4_1 <- substr(candidate_4_1, 1, 1)
used_profiles <- c(used_profiles, candidate_4_1)
excluded_statements_4_2 <- names(which(table(used_profiles) > 1))
ban_statements_4_2 <- setdiff(ban_statements, excluded_statements_4_2)
no_ban_statements_4_2 <- setdiff(no_ban_statements, excluded_statements_4_2)
if (comparisons[4] == "same_position") {
  if (position_candidate_4_1 == "ban") {
    ban_statements_4_2 <- ban_statements_4_2[!str_starts(ban_statements_4_2, frame_candidate_4_1)] ## remember this also excludes candidate_4_1 statement
    remaining_pool_4_2 <- setdiff(ban_statements_4_2, used_profiles)
    if (length(remaining_pool_4_2) == 0) {
      remaining_pool_4_2 <- ban_statements_4_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_4_1 because that is will be the opposite position from the vector here)
    }
  } else if (position_candidate_4_1 == "no_ban") {
    no_ban_statements_4_2 <- no_ban_statements_4_2[!str_starts(no_ban_statements_4_2, frame_candidate_4_1)]
    remaining_pool_4_2 <- setdiff(no_ban_statements_4_2, used_profiles)
    if (length(remaining_pool_4_2) == 0) {
      remaining_pool_4_2 <- no_ban_statements_4_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_4_1 because that is will be the opposite position from the vector here)
    }
  }
} else if (comparisons[4] == "different_position") {
  if (position_candidate_4_1 == "ban") {
    remaining_pool_4_2 <- setdiff(no_ban_statements_4_2, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_4_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_4_2) == 0) {
      remaining_pool_4_2 <- no_ban_statements ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full no_ban_statements and will enforce C2 just below)
    }
  } else if (position_candidate_4_1 == "no_ban") {
    remaining_pool_4_2 <- setdiff(ban_statements_4_2, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_4_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_4_2) == 0) {
      remaining_pool_4_2 <- ban_statements_4_2  ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full ban_statements and will enforce C2 just below)
    }
  }
} else {
  stop("invalid value of comparisons")
}
remaining_pool_4_2 <- setdiff(remaining_pool_4_2, c(candidate_3_1, candidate_3_2, candidate_4_1)) ## essential to enforce constraint C2
candidate_4_2 <- sample(remaining_pool_4_2, 1)

used_profiles <- c(used_profiles, candidate_4_1, candidate_4_2)
if (running_separately == FALSE) {
 print(paste0("Pair 4 comparison: ", comparisons[4]))
 print(paste0("candidate_4_1: ", candidate_4_1))
 print(paste0("candidate_4_2: ", candidate_4_2))
 mat_pairs <- rbind(c(candidate_1_1, candidate_1_2),
                   c(candidate_2_1, candidate_2_2),
                   c(candidate_3_1, candidate_3_2),
                   c(candidate_4_1, candidate_4_2))
  rownames(mat_pairs) <- c("Pair 1", "Pair 2", "Pair 3", "Pair 4")
  colnames(mat_pairs) <- c("Candidate_1", "Candidate_2")
  print(comparisons)
  print(mat_pairs)
  table(mat_pairs)
}


########################
######## Pair 5 ########
########################
# determine which statements are still required (i.e., have not yet appeared) -- there is usually only be 0 or 1 in here 
required_statements_after_4 <- setdiff(all_statements, used_profiles)
stopifnot(length(required_statements_after_4) %in% c(0, 1, 2))
excluded_statements_after_4 <- names(which(table(used_profiles) > 1))
if (length(required_statements_after_4) > 0) {
  remaining_pool_5_1 <- sample(required_statements_after_4, 1)
} else {
  ## this may not work as as -- for some tricky cases we may have to assign pair 4 and pair 5 jointly. but just to get it going...
  #  print("for some tricky cases, will need to do this randomization jointly with pair 5 (e.g. send a required statement to pair 5 and use a repeat in pair 4")
  remaining_pool_5_1 <- setdiff(all_statements, c(excluded_statements_after_4, candidate_4_1, candidate_4_2)) ## to enforce constraint C2
}
candidate_5_1 <- sample(remaining_pool_5_1, 1)
position_candidate_5_1 <- report_position(candidate_5_1)
frame_candidate_5_1 <- substr(candidate_5_1, 1, 1)
used_profiles <- c(used_profiles, candidate_5_1)
excluded_statements_5_2 <- names(which(table(used_profiles) > 1))
ban_statements_5_2 <- setdiff(ban_statements, excluded_statements_5_2)
no_ban_statements_5_2 <- setdiff(no_ban_statements, excluded_statements_5_2)
if (comparisons[5] == "same_position") {
  if (position_candidate_5_1 == "ban") {
    ban_statements_5_2 <- ban_statements_5_2[!str_starts(ban_statements_5_2, frame_candidate_5_1)] ## remember this also excludes candidate_5_1 statement
    remaining_pool_5_2 <- setdiff(ban_statements_5_2, used_profiles)
    if (length(remaining_pool_5_2) == 0) {
      remaining_pool_5_2 <- ban_statements_5_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_5_1 because that is will be the opposite position from the vector here)
    }
  } else if (position_candidate_5_1 == "no_ban") {
    no_ban_statements_5_2 <- no_ban_statements_5_2[!str_starts(no_ban_statements_5_2, frame_candidate_5_1)]
    remaining_pool_5_2 <- setdiff(no_ban_statements_5_2, used_profiles)
    if (length(remaining_pool_5_2) == 0) {
      remaining_pool_5_2 <- no_ban_statements_5_2 ## ideally, use up another position we have not yet used (don't have to exclude candidate_5_1 because that is will be the opposite position from the vector here)
    }
  }
} else if (comparisons[5] == "different_position") {
  if (position_candidate_5_1 == "ban") {
    remaining_pool_5_2 <- setdiff(no_ban_statements_5_2, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_5_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_5_2) == 0) {
      remaining_pool_5_2 <- no_ban_statements_5_2 ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full no_ban_statements and will enforce C2 just below)
    }
  } else if (position_candidate_5_1 == "no_ban") {
    remaining_pool_5_2 <- setdiff(ban_statements_5_2, used_profiles) ## ideally, use up another position we have not yet used (don't have to exclude candidate_5_1 because that is will be the opposite position from the vector here)
    if (length(remaining_pool_5_2) == 0) {
      remaining_pool_5_2 <- ban_statements_5_2  ## situation where there are no unused statements that satisfy constraints, so can re-use a statement from the first pair (just setting it to the full ban_statements and will enforce C2 just below)
    }
  }
} else {
  stop("invalid value of comparisons")
}

remaining_pool_5_2 <- setdiff(remaining_pool_5_2, c(candidate_4_1, candidate_4_2, candidate_5_1)) ## essential to enforce constraint C2
candidate_5_2 <- sample(remaining_pool_5_2, 1)

used_profiles <- c(used_profiles, candidate_5_1, candidate_5_2)

if (running_separately == FALSE) {
  print(paste0("Pair 5 comparison: ", comparisons[5]))
  print(paste0("candidate_5_1: ", candidate_5_1))
  print(paste0("candidate_5_2: ", candidate_5_2))
}

if (mark_reverse == TRUE) { 
  ## reversing candidate order
  orig_candidate_1_1 <- candidate_1_1
  orig_candidate_1_2 <- candidate_1_2
  orig_candidate_2_1 <- candidate_2_1
  orig_candidate_2_2 <- candidate_2_2
  orig_candidate_3_1 <- candidate_3_1
  orig_candidate_3_2 <- candidate_3_2
  orig_candidate_4_1 <- candidate_4_1
  orig_candidate_4_2 <- candidate_4_2
  orig_candidate_5_1 <- candidate_5_1
  orig_candidate_5_2 <- candidate_5_2
  
  candidate_1_1 <- orig_candidate_5_1
  candidate_1_2 <- orig_candidate_5_2
  candidate_2_1 <- orig_candidate_4_1
  candidate_2_2 <- orig_candidate_4_2
  candidate_4_1 <- orig_candidate_2_1
  candidate_4_2 <- orig_candidate_2_2
  candidate_5_1 <- orig_candidate_1_1
  candidate_5_2 <- orig_candidate_1_2
  
  comparisons <- orig_comparisons
}


mat_candidate_pairs["Pair 1", c("Candidate 1", "Candidate 2")] <- c(candidate_1_1, candidate_1_2)
mat_candidate_pairs["Pair 2", c("Candidate 1", "Candidate 2")] <- c(candidate_2_1, candidate_2_2)
mat_candidate_pairs["Pair 3", c("Candidate 1", "Candidate 2")] <- c(candidate_3_1, candidate_3_2)
mat_candidate_pairs["Pair 4", c("Candidate 1", "Candidate 2")] <- c(candidate_4_1, candidate_4_2)
mat_candidate_pairs["Pair 5", c("Candidate 1", "Candidate 2")] <- c(candidate_5_1, candidate_5_2)

if (running_separately == FALSE) {
 print(mat_candidate_pairs)
 table(mat_candidate_pairs)
}



