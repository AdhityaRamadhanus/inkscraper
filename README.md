# Linkedin-Scraper
[![Build Status](https://travis-ci.org/AdhityaRamadhanus/Linkedin-Scraper.svg?branch=master)](https://travis-ci.org/AdhityaRamadhanus/Linkedin-Scraper) [![Dependencies Status](https://david-dm.org/adhityaramadhanus/Linkedin-Scraper.svg)](https://david-dm.org/adhityaramadhanus/Linkedin-Scraper) [![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)

<p>
  <a href="#installation">Installation</a> |
  <a href="#documentation">Documentation</a> |
  <a href="#features">Features</a> |
  <a href="#licenses">License</a>
  <br><br>
  <blockquote>
  Scraping jobs from linkedin using nodejs, expressjs and mongodb as storage.
  </blockquote>
</p>

Installation
------------

* git clone https://github.com/AdhityaRamadhanus/Linkedin-Scraper.git
* cd Linkedin-Scraper
* npm install
* npm start
* set .env files (i'm using dotenv, see here https://www.npmjs.com/package/dotenv for documentation)
* Example of .env 
```js
NODE_ENV=development

MONGOLAB_URI='mongodb://localhost:27017/linkedin-scraper'
DEFAULT_LINKEDIN_LIST_URL='https://uk.linkedin.com/jobs/search?start=0&count=25'
APIDOC=true
```

Usage
------------
* Hit /scraper/insert to bulk insert jobs (this is faster than upsert (below) but if there's existing jobs it will fail)
* If you want to scrape list of jobs from other url (not the default you provide) you can use querystring url, example (you need to encode the url first if there's querystring in it)
```js
http://localhost:3000/scraper/insert?url=https%3A%2F%2Fuk.linkedin.com%2Fjobs%2Fsearch%3Fstart%3D0%26count%3D25
```
* Hit /scraper/update to upsert jobs
* Hit /scraper/details to get details of every job you have scraped 
* You can see the jobs in /api/jobs or /api/jobs/:jobid 

Documentation
------------

* npm install -g apidoc
* cd Linkedin-Scraper
* npm run gen-doc
* add APIDOC=true in .env
* enjoy, documentation can be found in "/apidoc"

Features
------------

* Scrap Listing Page (Job listing, by default this will scrape https://www.linkedin.com/jobs/view-all)
* Scrap Details Page (Job Details Page)
* Restful API for jobs scraped from linkedin
* Full-text search using built-in mongoose (ofc built-in mongodb too)

License
----

MIT © [Adhitya Ramadhanus]
