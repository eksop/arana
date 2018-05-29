# arana

Arana is web scraper.

## Install

You need to install casperjs and phantomjs for arana to work

``` shell
# Make sure npm is installed
$ npm -g install phantomjs-prebuilt casperjs
```

Then clone the repo

``` shell
$ git clone https://github.com/rajats105/arana.git ~/arana
```

## Examples

Scraping job lisitings from naukri

Scraper config file

``` javascript
{
  "host": "naukri.com",
  "selector": "div.row[itemtype=\"http://schema.org/JobPosting\"]",
  "waiter": "div.row[type=tuple]",
  "pagination": [
    "div.pagination > a:nth-child(2) > button",
    "div.pagination > a > button"
  ],
  "parser": [
    ["company_image", "a.content div.banner img", "attr", "src"],
    ["company_name", "a.content span.org", "text", ""],
    ["description", "a.content div.more span.desc", "text", ""],
    ["experience", "a.content span.exp", "text", ""],
    ["location", "a.content span.loc", "text", ""],
    ["posted_by", "div.other_details div.rec_details a", "text", ""],
    ["posted_on", "div.other_details div.rec_details span.date", "text", ""],
    ["salary", "div.other_details span.salary", "text", ""],
    ["skills", "a.content div.more div.desc span.skill", "text", ""],
    ["title", "a.content span.desig", "text", ""],
    ["url", "a.content", "attr", "href"]
  ]
}
```

Run the scrape command

``` shell
$ cd ~/arana

$ casperjs ~/arana/bin/crawler.js --disk-cache=true --url="https://www.naukri.com/jobs-in-bangalore" --crawler=~/arana/config/naukri.json --pages=1 --stdout | jq .
```

Scraped output

``` javascript
{
  "company_image": false,
  "company_name": "AUTODESK INDIA PRIVATE LIMITED",
  "description": "Experience deciding when to use common software design and architectural patterns, including server-less ...",
  "experience": "7-12 yrs",
  "location": "Bengaluru",
  "posted_by": "Priyanka Sharma",
  "posted_on": "Just Now",
  "salary": "Not disclosed",
  "skills": "devops, restful, aws, java, html, ajax, Bash Scripting, perl scripting...",
  "title": false,
  "url": "https://www.naukri.com/job-listings-Digital-Data-Platform-Engineer-AUTODESK-INDIA-PRIVATE-LIMITED-Bengaluru-7-to-12-years-290518004999?src=jobsearchDesk&sid=15275912888203&xp=1&px=1"
}
{
  "company_image": false,
  "company_name": "Ways & Works Consulting LLP",
  "description": false,
  "experience": "3-7 yrs",
  "location": "Bengaluru",
  "posted_by": "Neha",
  "posted_on": "Just Now",
  "salary": "4,00,000 - 9,00,000 P.A.",
  "skills": "Node.Js, Usability, Usability Flash action script, HTML, Mean Stack, J2Ee...",
  "title": false,
  "url": "https://www.naukri.com/job-listings-Node-JS-Developers-Ways-Works-Consulting-LLP-Bengaluru-3-to-7-years-290518004997?src=jobsearchDesk&sid=15275912888203&xp=2&px=1"
}
```
