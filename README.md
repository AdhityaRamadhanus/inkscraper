# Linkedin-Scraper
[![Build Status](https://travis-ci.org/AdhityaRamadhanus/Linkedin-Scraper.svg?branch=master)](https://travis-ci.org/AdhityaRamadhanus/Linkedin-Scraper)[![Dependencies Status](https://david-dm.org/adhityaramadhanus/Linkedin-Scraper.svg)](https://david-dm.org/adhityaramadhanus/Linkedin-Scraper)  
Linkedin Jobs Scraper using nodejs,expressjs and mongodb as storage

Install :
* Clone
* run npm Install
* run npm start
* enjoy, documentation can be found in "/"

Features :
* Scrap Listing Page (Job listing, by default this will scrape https://www.linkedin.com/jobs/view-all)
* Scrap Details Page (Job Details Page)
* Full-text search using built-in mongoose (ofc built-in mongodb too)

Known Issue :
* If you deploy this to heroku, scraping would probably can never be done as linkedin apparently blocked Heroku IP (maybe other cloud infrastructure too like DigitalOcean)
