library(tidyverse)
library(truncnorm)

# generate placeholder dataset, where each row represents a zip code and a column shows the estimated share of instituion-owned homes in that zip code
n_zip <- 30000
set.seed(123)
zip_codes <- sort(sample(10000:99999, size=n_zip))
institutional_share <- round(rtruncnorm(n_zip, a=0, b=100, mean=15, sd=5), 
                             1)

df <- data.frame(zip_code=zip_codes,
                 pct_institution=institutional_share)
write.csv(df, 
          "Qualtrics/Data_Formatted/sandbox_zip_codes.csv",
          row.names=FALSE)
