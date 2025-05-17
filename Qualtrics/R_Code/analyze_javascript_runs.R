library(jsonlite)
library(tidyverse)
library(stringr)

# load and format data
json_data <- fromJSON("Qualtrics/JavaScript_Code/simulation_results_2025-05-16T20-52-13-891Z.json")
df <- as.data.frame(json_data)
df <- df %>%
  mutate(name_comparison=comparison) %>%
  mutate(comparison = str_remove_all(comparison, "^c\\(|\\)$")) %>%
  mutate(comparison = str_replace_all(comparison, '"', '')) %>%
  separate(comparison, into = paste0("comparison_", 1:5), sep = ",\\s*")

df <- df %>%
      arrange(desc(comparison_1), desc(comparison_2), desc(comparison_3), desc(comparison_4), desc(comparison_5))
head(df)

gc()

# initializng stuff for simulations
n_rep <- nrow(json_data)
vec_n_profile_twice <- rep(NA, n_rep)      
vec_n_profile_more_than_twice <- rep(NA, n_rep)    
vec_n_profile <- rep(NA, n_rep)
vec_repeats <- rep(NA, n_rep)
vec_matching_rows <- rep(NA, n_rep)
mat_profile_checks <- as.data.frame(matrix(NA, nrow=n_rep, ncol=14))
colnames(mat_profile_checks) <- c("combination", 
                                  "n_profile", "n_profile_twice", "n_profile_more_than_twice",
                                  "n_repeated_in_consecutive", "n_matching_rows",
                                  "P_A", "P_B", "R_A", "R_B", ## counts of each statement
                                  "M_A", "M_B", "T_A", "T_B") ## counts of each statement

candidate_pairs <- list(
  c("candidate_1_1", "candidate_1_2"),
  c("candidate_2_1", "candidate_2_2"),
  c("candidate_3_1", "candidate_3_2"),
  c("candidate_4_1", "candidate_4_2"),
  c("candidate_5_1", "candidate_5_2"))

# helper functions for simulations
get_prefix <- function(candidate_name) {
  str_sub(candidate_name, start = 1, end = 1)
}
count_prefix_matches <- function(row) {
  sum(sapply(candidate_pairs, function(pair) {
    get_prefix(row[pair[1]]) == get_prefix(row[pair[2]])
  }))
}
check_repeated_profiles <- function(row) {
  repeat_count <- 0
  for (i in 1:4) {
    task_1_1 <- as.character(row[paste0("candidate_", i, "_1")])
    task_1_2 <- as.character(row[paste0("candidate_", i, "_2")])
    task_2_1 <- as.character(row[paste0("candidate_", i + 1, "_1")])
    task_2_2 <- as.character(row[paste0("candidate_", i + 1, "_2")])
    if (task_1_1 %in% c(task_2_1, task_2_2) || task_1_2 %in% c(task_2_1, task_2_2)) {
      repeat_count <- repeat_count + 1
    }
  }
  return(repeat_count)
}

# run checks
candidate_cols <- c("candidate_1_1", "candidate_1_2", "candidate_2_1", "candidate_2_2",
                    "candidate_3_1", "candidate_3_2", "candidate_4_1", "candidate_4_2",
                    "candidate_5_1", "candidate_5_2")

df$all_candidates <- as.list(as.data.frame(t(df[, candidate_cols])))
df$all_candidates <- lapply(df$all_candidates, unname)
mat_profile_checks$n_repeated_in_consecutive <- apply(df, 1, check_repeated_profiles)
mat_profile_checks$n_matching_rows <- apply(df, 1, function(row) count_prefix_matches(row)) 
mat_profile_checks$combination <- df$name_comparison

vec_rep <- 1:n_rep
vec_rep <- 500001:1000000
for (rep in vec_rep) {
  if (rep %% 10000 == 0) {  # Check if i is a multiple of 10,000
    print(rep)
  }
  one_row <- df[rep, ]
  n_profile_twice <- length(which(table(one_row$all_candidates[[paste0("V", rep)]]) == 2))
  n_profile_more_than_twice <- length(which(table(one_row$all_candidates[[paste0("V", rep)]]) > 2))
  n_profile <- length(names(table(one_row$all_candidates[[paste0("V", rep)]])))
  
  mat_profile_checks$n_profile[rep] <- n_profile
  mat_profile_checks$n_profile_twice[rep] <- n_profile_twice
  mat_profile_checks$n_profile_more_than_twice[rep] <- n_profile_more_than_twice
  position_1 <- rep(NA, 5)
  position_1[one_row[, c("candidate_1_1", "candidate_2_1", "candidate_3_1", "candidate_4_1", "candidate_5_1")] %in% c("P_A", "P_B", "R_A", "R_B")] <- "ban"
  position_1[one_row[, c("candidate_1_1", "candidate_2_1", "candidate_3_1", "candidate_4_1", "candidate_5_1")] %in% c("M_A", "M_B", "T_A", "T_B")] <- "no_ban"
  
  position_2 <- rep(NA, 5)
  position_2[one_row[, c("candidate_1_2", "candidate_2_2", "candidate_3_2", "candidate_4_2", "candidate_5_2")] %in% c("P_A", "P_B", "R_A", "R_B")] <- "ban"
  position_2[one_row[, c("candidate_1_2", "candidate_2_2", "candidate_3_2", "candidate_4_2", "candidate_5_2")] %in% c("M_A", "M_B", "T_A", "T_B")] <- "no_ban"
  
  mat_profile_checks[rep, "n_matching_rows"] <- sum(position_1 == position_2)
  
  mat_profile_checks[rep, "P_A"] <- sum(one_row %>% select(starts_with("candidate")) == "P_A")
  mat_profile_checks[rep, "P_B"] <- sum(one_row %>% select(starts_with("candidate")) == "P_B")
  mat_profile_checks[rep, "R_A"] <- sum(one_row %>% select(starts_with("candidate")) == "R_A")
  mat_profile_checks[rep, "R_B"] <- sum(one_row %>% select(starts_with("candidate")) == "R_B")
  
  mat_profile_checks[rep, "M_A"] <- sum(one_row %>% select(starts_with("candidate")) == "M_A")
  mat_profile_checks[rep, "M_B"] <- sum(one_row %>% select(starts_with("candidate")) == "M_B")
  mat_profile_checks[rep, "T_A"] <- sum(one_row %>% select(starts_with("candidate")) == "T_A")
  mat_profile_checks[rep, "T_B"] <- sum(one_row %>% select(starts_with("candidate")) == "T_B")  
}



mat_profile_checks$combination <- sapply(mat_profile_checks$combination, function(x) paste(x, collapse = ", "))

mat_profile_checks <- mat_profile_checks %>%
                      arrange(combination)

mat_profile_checks <- mat_profile_checks %>%
                      group_by(combination) %>%
                      summarise(mean_n_profile=mean(n_profile),
                                mean_n_profile_twice=mean(n_profile_twice),
                                mean_n_profile_more_than_twice=mean(n_profile_more_than_twice),
                                mean_n_repeated_in_consecutive=mean(n_repeated_in_consecutive),
                                mean_n_matching_rows=mean(n_matching_rows),
                                mean_P_A=round(mean(P_A), 2),
                                mean_P_B=round(mean(P_B), 2),
                                mean_R_A=round(mean(R_A), 2),
                                mean_R_B=round(mean(R_B), 2),
                                mean_M_A=round(mean(M_A), 2),
                                mean_M_B=round(mean(M_B), 2),
                                mean_T_A=round(mean(T_A), 2),
                                mean_T_B=round(mean(T_B), 2))

mat_profile_checks <- mat_profile_checks %>%
                      arrange(mean_n_profile)

mat_profile_checks

write.csv(mat_profile_checks,
          file=paste0("Qualtrics/JavaScript_Code/simulation_results_JavaScript_code_11_20", Sys.Date(), ".csv"),
          row.names=FALSE)








