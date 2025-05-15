rm(list=ls())
library(tidyverse)

#set.seed(123)

# set up for testing
n_check <- 10000
combinations <- expand.grid(rep(list(c("same_position", "different_position")), 5))
combinations <- combinations[rowSums(combinations == "same_position") %in% c(2, 3), ]
combinations <- as.data.frame(lapply(combinations, as.character))
rownames(combinations) <- NULL
names(combinations) <- c("pair_1", "pair_2", "pair_3", "pair_4", "pair_5")
combinations <- combinations %>%
                arrange(desc(pair_1), desc(pair_2), desc(pair_3), desc(pair_4), desc(pair_5))
mat_profile_checks <- matrix(NA, nrow=nrow(combinations), ncol=15)
colnames(mat_profile_checks) <- c("combination", 
                                  "n_profile", "n_profile_twice", "n_profile_more_than_twice", "n_repeated_in_consecutive", "n_matching_rows", "n_nonmatching_rows",
                                  "P_A", "P_B", "R_A", "R_B", "M_A", "M_B", "T_A", "T_B")
vec_to_run <- 1:nrow(combinations)

for (comb in vec_to_run) {
  print(comb)
  comparisons <- as.character(combinations[comb, ])
  name_one_combination <- paste(comparisons, collapse="/")
  mat_profile_checks[comb, "combination"] <- name_one_combination
  
  ## initialize objects to store results from testing
  vec_n_profile_twice <- rep(NA, n_check)      
  vec_n_profile_more_than_twice <- rep(NA, n_check)    
  vec_n_profile <- rep(NA, n_check)
  vec_repeats <- rep(NA, n_check)
  vec_matching_rows <- rep(NA, n_check)
  vec_nonmatching_rows <- rep(NA, n_check)
  vec_P_A <- rep(NA, n_check)
  vec_P_B <- rep(NA, n_check)
  vec_R_A <- rep(NA, n_check)
  vec_R_B <- rep(NA, n_check) 
  vec_M_A <- rep(NA, n_check)
  vec_M_B <- rep(NA, n_check)
  vec_T_A <- rep(NA, n_check)
  vec_T_B <- rep(NA, n_check)  

  
  for (rep in 1:n_check) {
    source("Qualtrics/R_Code/survey_randomization.R")
    n_profile_twice <- length(which(table(mat_candidate_pairs) == 2))
    n_profile_more_than_twice <- length(which(table(mat_candidate_pairs) > 2))
    n_profile <- length(names(table(mat_candidate_pairs)))

    vec_n_profile[rep] <- n_profile    
    if (n_profile != 8) {
      stop("debugging")
    }
    vec_n_profile_twice[rep] <- n_profile_twice
    vec_n_profile_more_than_twice[rep] <- n_profile_more_than_twice
    
    repeats <- logical(nrow(mat_candidate_pairs))
    for (i in 2:nrow(mat_candidate_pairs)) {
      repeats[i] <- any(mat_candidate_pairs[i, ] %in% mat_candidate_pairs[i - 1, ])
    }
    vec_repeats[rep] <- sum(vec_n_profile_more_than_twice[rep])
    
    position_1 <- rep(NA, nrow(mat_candidate_pairs))
    position_1[mat_candidate_pairs[, 1] %in% c("P_A", "P_B", "R_A", "R_B")] <- "ban"
    position_1[mat_candidate_pairs[, 1] %in% c("M_A", "M_B", "T_A", "T_B")] <- "no_ban"
    position_2 <- rep(NA, nrow(mat_candidate_pairs))
    position_2[mat_candidate_pairs[, 2] %in% c("P_A", "P_B", "R_A", "R_B")] <- "ban"
    position_2[mat_candidate_pairs[, 2] %in% c("M_A", "M_B", "T_A", "T_B")] <- "no_ban"    
    vec_matching_rows[rep] <- sum(position_1 == position_2)
    vec_nonmatching_rows[rep] <- sum(position_1 != position_2)
    
    vec_P_A[rep] <- sum(mat_candidate_pairs == "P_A")
    vec_P_B[rep] <- sum(mat_candidate_pairs == "P_B")
    vec_R_A[rep] <- sum(mat_candidate_pairs == "R_A")
    vec_R_B[rep] <- sum(mat_candidate_pairs == "R_B")
    vec_M_A[rep] <- sum(mat_candidate_pairs == "M_A")
    vec_M_B[rep] <- sum(mat_candidate_pairs == "M_B")
    vec_T_A[rep] <- sum(mat_candidate_pairs == "T_A")
    vec_T_B[rep] <- sum(mat_candidate_pairs == "T_B")
  }
  mat_profile_checks[comb, "n_profile"] <- mean(vec_n_profile)
  mat_profile_checks[comb, "n_profile_twice"] <- mean(vec_n_profile_twice)
  mat_profile_checks[comb, "n_profile_more_than_twice"] <- mean(vec_n_profile_more_than_twice)
  mat_profile_checks[comb, "n_repeated_in_consecutive"] <- sum(vec_repeats)
  mat_profile_checks[comb, "n_matching_rows"] <-  mean(vec_matching_rows)
  mat_profile_checks[comb, "n_nonmatching_rows"] <-  mean(vec_nonmatching_rows)
  
  mat_profile_checks[comb, "P_A"] <-  round(mean(vec_P_A), 2)
  mat_profile_checks[comb, "P_B"] <-  round(mean(vec_P_B), 2)
  mat_profile_checks[comb, "R_A"] <-  round(mean(vec_R_A), 2)
  mat_profile_checks[comb, "R_B"] <-  round(mean(vec_R_B), 2)
  mat_profile_checks[comb, "M_A"] <-  round(mean(vec_M_A), 2)
  mat_profile_checks[comb, "M_B"] <-  round(mean(vec_M_B), 2)
  mat_profile_checks[comb, "T_A"] <-  round(mean(vec_T_A), 2)
  mat_profile_checks[comb, "T_B"] <-  round(mean(vec_T_B), 2)
}
df_profile_checks <- as.data.frame(mat_profile_checks)
df_profile_checks
name_one_combination
mat_candidate_pairs
table(mat_candidate_pairs)

write.csv(df_profile_checks,
          file=paste0("Qualtrics/R_Code/simulation_results_R_code_", n_check, "_reps_", Sys.Date(), ".csv"),
          row.names=FALSE)

stop("999 jeremy to add: just confirm that all statements appear equally often across all iterations in a given scenario, then across all scenarios")



