# arana

``` text
  __ _ _ __ __ _ _ __   __ _
 / _` | '__/ _` | '_ \ / _` |
| (_| | | | (_| | | | | (_| |
 \__,_|_|  \__,_|_| |_|\__,_|
```

Arana is a web scraper built on top of casperJS.

It works with purely dynamically loaded websites.

## Install

You need to install casperjs and phantomjs for arana to work

``` shell
# Make sure npm is installed
$ npm -g install phantomjs-prebuilt casperjs

# Install click from pip
$ pip install click
```

Then clone the repo

``` shell
$ git clone https://github.com/rajats105/arana.git ~/arana
```

## Examples

Scraping job lisitings from apple.com

Scraper config file

``` javascript
{
  "host": "apple.com",
  "selector": "table#jobs_list tbody tr.searchresult",
  "waiter": "table#jobs_list tbody tr.searchresult td.title a",
  "pagination": [
    "a.arrow_next.enabled"
  ],
  "parser": [
    ["title", "tr.searchresult td.title a", "text", ""],
    ["job_id", "tr.searchresult td.title a", "attr", "id"],
    ["job_type", "tr.searchresult td:nth-child(2) p", "text", ""],
    ["location", "tr.searchresult td:nth-child(3) p", "text", ""],
    ["posted_on", "tr.searchresult td:nth-child(4) p", "text", ""]
  ]
}
```

Run the scrape command

``` shell
$ cd ~/arana

# Provide the scrape URL and CONFIG file as arguments

$ ./arana -p 1 'https://jobs.apple.com/in/search#&t=0&lo=0*IND&pN=3' ./config/apple.json  | jq .
```

Scraped output

``` javascript
{
  "error": false,
  "original_url": "https://jobs.apple.com/in/search#&t=0&lo=0*IND&pN=3",
  "data": [
    {
      "url": "https://jobs.apple.com/in/search#&t=0&lo=0*IND&pN=3",
      "data": [
        {
          "job_id": "jobs_list-113400504",
          "job_type": "Information Systems and Technology",
          "location": "Hyderabad",
          "posted_on": "4-June-2018",
          "title": "Senior UI Engineer - Apple Online Store"
        },
        {
          "job_id": "jobs_list-113408197",
          "job_type": "Information Systems and Technology",
          "location": "Hyderabad",
          "posted_on": "4-June-2018",
          "title": "Security PenTest Engineer - Apple Online Store"
        },
        {
          "job_id": "jobs_list-113545179",
          "job_type": "Marketing",
          "location": "Gurgaon",
          "posted_on": "10-April-2018",
          "title": "CD - Art"
        }
      ]
    }
  ],
  "next_url": null
}
```
