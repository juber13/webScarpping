const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const arr = [];
arr.push(["Job Title", "Company name", "Location", "Salary", "Posted Date"])

const webScraping = () => {
    axios.get('https://www.linkedin.com/jobs/search?keywords=tech%20job&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0')
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const card = $('li');
            card.each((idx, ele) => {
                const container = $(ele);
                //  console.log(container);
                const jobtitle = container.find('.base-search-card__title').text();
                const company = container.find('.hidden-nested-link').text();
                const location = container.find('.job-search-card__location').text()
                const salary = container.find('.job-search-card__salary-info').text()
                const posteddate = container.find('.job-search-card__listdate').text()
                console.log(jobtitle)
                if (jobtitle !== '' && company !== '' && posteddate !== '') {
                    arr.push([jobtitle, company, location, salary, posteddate])
                }
                //  console.log(arr[arr.length  -1 ])

                if (idx === card.length - 1) {
                    const workbook = xlsx.utils.book_new();
                    const sheetData = arr;
                    const sheet = xlsx.utils.aoa_to_sheet(sheetData);
                    xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');
                    xlsx.writeFile(workbook, 'output.xlsx');
                    console.log('XLSX file created successfully!');
                }
            })

        })
        .catch(error => {
            console.error('Error:', error.message); // Handle errors
        });


}

webScraping();


