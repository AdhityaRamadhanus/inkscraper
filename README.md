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
`
* git clone https://github.com/AdhityaRamadhanus/Linkedin-Scraper.git
* cd Linkedin-Scraper
* npm install
* npm start
* set .env files (i'm using dotenv, see here https://www.npmjs.com/package/dotenv for documentation), you only need to set MONGOLAB_URI in .env
`
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
