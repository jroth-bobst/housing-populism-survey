rm(list=ls())
library(tidyverse)

#set.seed(123)

# set up for testing
n_check <- 10000
combinations <- expand.grid(rep(list(c("same", "different")), 5))
combinations <- combinations[rowSums(combinations == "same") %in% c(2, 3), ]
combinations <- as.data.frame(lapply(combinations, as.character))
rownames(combinations) <- NULL
names(combinations) <- c("pair_1", "pair_2", "pair_3", "pair_4", "pair_5")
combinations <- combinations %>%
                arrange(desc(pair_1), desc(pair_2), desc(pair_3), desc(pair_4), desc(pair_5))
mat_profile_checks <- matrix(NA, nrow=nrow(combinations), ncol=7)
colnames(mat_profile_checks) <- c("combination", "n_profile", "n_profile_twice", "n_profile_more_than_twice", "n_repeated_in_consecutive", "n_matching_rows", "n_nonmatching_rows")

# all candidate profiles
all_statements <- c("P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B")

# initialize indicator of whether we are reversing the comparison order (for the five scenarios starting with different/different, it was easier to code the constraints for the reverse scenario (i.e. ending with different/different))
mark_reverse <- FALSE

for (comb in 1:nrow(combinations)) {
  print(comb)
  comparisons <- as.character(combinations[comb, ])
  name_one_combination <- paste(comparisons, collapse="/")
  mat_profile_checks[comb, "combination"] <- name_one_combination
  # for the five scenarios starting with different/different, it was easier to code the constraints for the reverse scenario (i.e. ending with different/different)
  # so we can just reverse the comparison order, run the code we have, then reverse the pairs at the end. it should still be stored under name_one_combination, though, so we do the change after defining name_one_combination
  if (comparisons[1] == "different" & comparisons[2] == "different") {
    mark_reverse <- TRUE
    print("reversing order of comparisons vector")
    comparisons <- rev(comparisons)
  }
  
  ## initialize objects to store results from testing
  vec_n_profile_twice <- rep(NA, n_check)      
  vec_n_profile_more_than_twice <- rep(NA, n_check)    
  vec_n_profile <- rep(NA, n_check)
  vec_repeats <- rep(NA, n_check)
  vec_matching_rows <- rep(NA, n_check)
  vec_nonmatching_rows <- rep(NA, n_check)
  
  for (rep in 1:n_check) {
    ## check that matrix of candidate pairs makes sense
    mat_candidate_pairs <- matrix(NA, nrow=5, ncol=2)
    rownames(mat_candidate_pairs) <- c("Pair 1", "Pair 2", "Pair 3", "Pair 4", "Pair 5")
    colnames(mat_candidate_pairs) <- c("Candidate 1", "Candidate 2")
    
    
    # Function to flip the frame (A ↔ B)
    swap_frame <- function(profile) {
      prefix <- substr(profile, 1, 2)
      frame <- substr(profile, 3, 3)
      return(paste0(prefix, ifelse(frame == "A", "B", "A")))
    }
    

    # keep track of used profiles
    used_profiles <- character(0)
    
    ########################
    ######## Pair 1 ########
    ########################
    candidate_1_1 <- sample(all_statements, 1)
    if (comparisons[1] == "same") {
      if (substr(candidate_1_1, 3, 3) == "A") {
        candidate_1_2 <- paste0(substr(candidate_1_1, 1, 1), "_B")
      } else if (substr(candidate_1_1, 3, 3) == "B") {
        candidate_1_2 <- paste0(substr(candidate_1_1, 1, 1), "_A")
      }
    } else {
      prefix_1 <- substr(candidate_1_1, 1, 1)
      remaining_options <- setdiff(all_statements[!substr(all_statements, 1, 1) %in% prefix_1], candidate_1_1)
      candidate_1_2 <- sample(remaining_options, 1)
    }
    used_profiles <- c(used_profiles, candidate_1_1, candidate_1_2)
    
    mat_candidate_pairs["Pair 1", c("Candidate 1", "Candidate 2")] <- c(candidate_1_1, candidate_1_2)
    comparisons
    mat_candidate_pairs
    table(mat_candidate_pairs)
    
    
    ########################
    ######## Pair 2 ########
    ########################
    remaining_pool <- setdiff(all_statements, used_profiles)
    if (comparisons[2] == "same") {
      # also eliminate the prefixes used in the previous pair
      prev_prefixes <- unique(substr(c(candidate_1_1, candidate_1_2), 1, 1))
      # eliminate any prefixes that appeared in pair 3
      available_prefixes <- setdiff(c("P", "R", "M", "T"), prev_prefixes)
      
      # randomly choose one of the remaining prefixes for a same-position pair
      chosen_prefix <- sample(available_prefixes, 1)
      candidate_2_1 <- paste0(chosen_prefix, "_A")
      candidate_2_2 <- paste0(chosen_prefix, "_B")
    } else {
      candidate_2_1 <- sample(remaining_pool, 1)
      prefix_2 <- substr(candidate_2_1, 1, 1)
      remaining_options <- setdiff(remaining_pool[!substr(remaining_pool, 1, 1) %in% prefix_2], candidate_2_1)
      candidate_2_2 <- sample(remaining_options, 1)
    }
    
    used_profiles <- c(used_profiles, candidate_2_1, candidate_2_2)
    
    mat_candidate_pairs["Pair 2", c("Candidate 1", "Candidate 2")] <- c(candidate_2_1, candidate_2_2)
    comparisons
    mat_candidate_pairs
    table(mat_candidate_pairs)
    
    ########################
    ######## Pair 3 ########
    ########################
    remaining_pool <- setdiff(all_statements, used_profiles)
    if (comparisons[3] == "same") {
      # eliminate the prefixes used in the previous pair
      prev_prefixes <- unique(substr(c(candidate_2_1, candidate_2_2), 1, 1))
      # starting to add conditions that only run for certain scenarios (might be needed)
      if (comparisons[1] == "same" | comparisons[2] == "same") {
        prev_prefixes <- unique(substr(used_profiles, 1, 1)) # so eliminating from all previous profiles, not just previous pair ONLY IF at least one of the previous two comparisons was "same" (otherwise the previous two comparisons would have used up all 4 prefixes already so we would need to repeat)
      }
      # eliminate any prefixes that appeared in pair 3
      available_prefixes <- setdiff(c("P", "R", "M", "T"), prev_prefixes)
      # randomly choose one of the remaining prefixes for a same-position pair
      chosen_prefix <- sample(available_prefixes, 1)
      candidate_3_1 <- paste0(chosen_prefix, "_A")
      candidate_3_2 <- paste0(chosen_prefix, "_B")
    } else {
      candidate_3_1 <- sample(remaining_pool, 1)
      prefix_3 <- substr(candidate_3_1, 1, 1)
      remaining_options <- setdiff(remaining_pool[!substr(remaining_pool, 1, 1) %in% prefix_3], candidate_3_1)
      candidate_3_2 <- sample(remaining_options, 1)
    }
    
    used_profiles <- c(used_profiles, candidate_3_1, candidate_3_2)
    
    mat_candidate_pairs["Pair 3", c("Candidate 1", "Candidate 2")] <- c(candidate_3_1, candidate_3_2)
    comparisons
    mat_candidate_pairs
    table(mat_candidate_pairs)
    
    ########################
    ######## Pair 4 ########
    ########################
    # determine which statements are still required (i.e., have not yet appeared)
    required_statements <- setdiff(all_statements, used_profiles)
    # eliminate any that have been used twice already
    available_statements <- setdiff(all_statements, names(which(table(used_profiles) > 1)))
    # also avoid repeating pair 3 profiles
    available_statements <- setdiff(available_statements, c(candidate_3_1, candidate_3_2))
    
    if (comparisons[4] == "same") {
      # only keep prefixes that appear twice (to allow both A and B)
      available_prefixes <- substr(available_statements, 1, 1)
      available_prefixes <- names(which(table(available_prefixes) > 1))
      
      # filter to required prefixes if any required statements are left AND those prefixes were not used in the previous pair
      required_prefixes <- substr(required_statements, 1, 1)
      prev_prefixes <- unique(substr(c(candidate_3_1, candidate_3_2), 1, 1))
      updated_required_prefixes <- setdiff(required_prefixes, prev_prefixes)
      if (length(updated_required_prefixes) > 0) {
        available_prefixes <- intersect(available_prefixes, required_prefixes)
      }
      chosen_prefix <- sample(available_prefixes, 1)
      chosen_statements <- sample(c(paste0(chosen_prefix, "_A"), paste0(chosen_prefix, "_B")), 2)
      candidate_4_1 <- chosen_statements[1]
      candidate_4_2 <- chosen_statements[2]
      
    } else {
      # ensure we include any required statements if available UNLESS we have two with the same prefix AND comparisons[5] == "same". in that case, we'd need them to be used in pair 5 to avoid having the same theme in both pair 4 and pair 5
      pool <- intersect(required_statements, available_statements)
      if (comparisons[5] == "same") {
        pool_prefixes <- substr(pool, 1, 1)
        prefix_pairs <- names(which(table(pool_prefixes) > 1))
        eliminate_statements <- c(paste0(prefix_pairs, "_A"), paste0(prefix_pairs, "_B"))
        pool <- setdiff(pool, eliminate_statements)
        available_statements <- setdiff(available_statements, eliminate_statements)
      }
      if (length(pool) > 0) {
        candidate_4_1 <- sample(pool, 1)
      } else {
        candidate_4_1 <- sample(available_statements, 1)
      }
      prefix_4 <- substr(candidate_4_1, 1, 1)
      remaining_options <- setdiff(available_statements[!substr(available_statements, 1, 1) %in% prefix_4], candidate_4_1)
      
      # select from required statements if applicable
      pool2 <- intersect(remaining_options, required_statements)
      if (comparisons[5] == "same") {
        pool2_prefixes <- substr(pool2, 1, 1)
        prefix_pairs <- names(which(table(pool2_prefixes) > 1))
        eliminate_statements <- c(paste0(prefix_pairs, "_A"), paste0(prefix_pairs, "_B"))
        pool2 <- setdiff(pool2, eliminate_statements)
        remaining_options <- setdiff(remaining_options, eliminate_statements)
      }
      if (length(pool2) > 0) {
        candidate_4_2 <- sample(pool2, 1)
      } else {
        candidate_4_2 <- sample(remaining_options, 1)
      }
    }
    
    used_profiles <- c(used_profiles, candidate_4_1, candidate_4_2)
    
    mat_candidate_pairs["Pair 4", c("Candidate 1", "Candidate 2")] <- c(candidate_4_1, candidate_4_2)
    comparisons
    mat_candidate_pairs
    table(mat_candidate_pairs)
    
    
    ########################
    ######## Pair 5 ########
    ########################
    # determine which statements are still required (i.e., have not yet appeared)
    required_statements <- setdiff(all_statements, used_profiles)
    # eliminate any that have been used twice already
    available_statements <- setdiff(all_statements, names(which(table(used_profiles) > 1)))
    # also avoid repeating pair 4 profiles
    available_statements <- setdiff(available_statements, c(candidate_4_1, candidate_4_2))
    
    if (comparisons[5] == "same") {
      # only keep prefixes that appear twice (to allow both A and B)
      available_prefixes <- substr(available_statements, 1, 1)
      available_prefixes <- names(which(table(available_prefixes) > 1))
      
      # filter to required prefixes if any required statements are left
      if (length(required_statements) > 0) {
        required_prefixes <- substr(required_statements, 1, 1)
        available_prefixes <- intersect(available_prefixes, required_prefixes)
      }
      
      chosen_prefix <- sample(available_prefixes, 1)
      chosen_statements <- sample(c(paste0(chosen_prefix, "_A"), paste0(chosen_prefix, "_B")), 2)
      candidate_5_1 <- chosen_statements[1]
      candidate_5_2 <- chosen_statements[2]
      
    } else {
      # ensure we include any required statements if available
      pool <- intersect(required_statements, available_statements)
      if (length(pool) > 0) {
        candidate_5_1 <- sample(pool, 1)
      } else {
        candidate_5_1 <- sample(available_statements, 1)
      }
      prefix_5 <- substr(candidate_5_1, 1, 1)
      remaining_options <- setdiff(available_statements[!substr(available_statements, 1, 1) %in% prefix_5], candidate_5_1)
      
      # select from required statements if applicable
      pool2 <- intersect(remaining_options, required_statements)
      if (length(pool2) > 0) {
        candidate_5_2 <- sample(pool2, 1)
      } else {
        candidate_5_2 <- sample(remaining_options, 1)
      }
    }
    
    used_profiles <- c(used_profiles, candidate_5_1, candidate_5_2)
    
    mat_candidate_pairs["Pair 5", c("Candidate 1", "Candidate 2")] <- c(candidate_5_1, candidate_5_2)
    comparisons
    mat_candidate_pairs
    table(mat_candidate_pairs)
    
    if (mark_reverse == TRUE) { 
      mat_reversed <- mat_candidate_pairs[nrow(mat_candidate_pairs):1, ]
      rownames(mat_reversed) <- rownames(mat_candidate_pairs) # this is reversing the pair labels (i.e. pair 1 in mat_candidate_pairs became pair 5 in mat_reversed, 2 became 4 and vice versa)
      mat_candidate_pairs <- mat_reversed
    }

    n_profile_twice <- length(which(table(mat_candidate_pairs) == 2))
    n_profile_more_than_twice <- length(which(table(mat_candidate_pairs) > 2))
    n_profile <- length(names(table(mat_candidate_pairs)))

    vec_n_profile[rep] <- n_profile    
    vec_n_profile_twice[rep] <- n_profile_twice
    vec_n_profile_more_than_twice[rep] <- n_profile_more_than_twice
    
    repeats <- logical(nrow(mat_candidate_pairs))
    for (i in 2:nrow(mat_candidate_pairs)) {
      repeats[i] <- any(mat_candidate_pairs[i, ] %in% mat_candidate_pairs[i - 1, ])
    }
    vec_repeats[rep] <- sum(vec_n_profile_more_than_twice[rep])
    
    prefixes_1 <- substr(as.character(mat_candidate_pairs[, "Candidate 1"]), 1, 1)
    prefixes_2 <- substr(as.character(mat_candidate_pairs[, "Candidate 2"]), 1, 1)
    
    vec_matching_rows[rep] <- sum(prefixes_1 == prefixes_2)
    vec_nonmatching_rows[rep] <- sum(prefixes_1 != prefixes_2)
  }
  mat_profile_checks[comb, "n_profile"] <- mean(vec_n_profile)
  mat_profile_checks[comb, "n_profile_twice"] <- mean(vec_n_profile_twice)
  mat_profile_checks[comb, "n_profile_more_than_twice"] <- mean(vec_n_profile_more_than_twice)
  mat_profile_checks[comb, "n_repeated_in_consecutive"] <- sum(vec_repeats)
  mat_profile_checks[comb, "n_matching_rows"] <- mean(vec_matching_rows)
  mat_profile_checks[comb, "n_nonmatching_rows"] <- mean(vec_nonmatching_rows)
}

mat_profile_checks
name_one_combination
mat_candidate_pairs
table(mat_candidate_pairs)
