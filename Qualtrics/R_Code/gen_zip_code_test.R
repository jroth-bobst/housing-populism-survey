library(tidyverse)
library(truncnorm)

# generate placeholder dataset, where each row represents a zip code and a column shows the estimated share of instituion-owned homes in that zip code
set.seed(123)
zip_codes <- 10000:99999
institutional_share <- round(rtruncnorm(length(zip_codes), a=0, b=100, mean=15, sd=5), 
                             1)

df <- data.frame(zip_code=as.character(zip_codes), # important to save as string for lookup table in javascript
                 pct_institution=institutional_share)
write.csv(df, 
          "Qualtrics/Data_Formatted/sandbox_zip_codes.csv",
          row.names=FALSE)
