library(readr)
library(jsonlite)
library(dplyr)

# registry
kzrkl_s <- read_csv2("../data/KZ2020reg20200908_csv/kzrkl_s.csv", locale=locale(encoding="cp1250"))
kzrkl <- read_csv2("../data/KZ2020reg20200908_csv/kzrkl.csv", locale=locale(encoding="cp1250"))
kzrk <- read_csv2("../data/KZ2020reg20200908_csv/kzrk.csv", locale=locale(encoding="cp1250"))

# číselníky
kzciskr <- read_csv2("../data/KZ2020ciselniky20200828_csv/kzciskr.csv", locale=locale(encoding="cp1250"))
cvs <- read_csv2("../data/KZ2020ciselniky20200828_csv/cvs.csv", locale=locale(encoding="cp1250"))

# export
kzciskr %>% select(1,2) %>% write_json("../data/kraje.json")

kzrkl_s %>% select(k=1, n=5, nk=6, r=9) %>% write_json("../data/strany.json")

kzrk %>%
  select(z=1, k=2, c=3, j=4, p=5, v=8, po=9, b=10) %>%
  mutate(s=1, f=1, q=1) %>%
  write_json("../data/kandidati.json")

table(substr(kzrk$PRIJMENI, nchar(kzrk$PRIJMENI), nchar(kzrk$PRIJMENI)) == "á")

                
       
       
       