const express = require('express')
const app = express()
const bp = require('body-parser')
const axios = require('axios')

const hostname = '0.0.0.0'
const port = 3000

app.use(bp.json())

app.get('/getQuote', (req, res) => {
    const options = {
        method: 'GET',
        url: 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
    }
    axios
        .request(options)
        .then(function(response) {
            if (response.data.quoteText != '' && response.data.quoteAuthor != '') {
                res.send({
                    quote: response.data.quoteText,
                    author: response.data.quoteAuthor
                })
            } else {
                res.send({
                    quote: 'Begin to weave and God will give you the thread. ',
                    author: 'German Proverb '
                })
            }
        })
        .catch(function(error) {
            res.send(error)
        })
})
app.get('/getWeather', (req, res) => {
    const weatherConfig = {
        method: 'GET',
        url: 'http://api.weatherapi.com/v1/current.json?key=fcac8b04d9a540d8951145104212208&q=India&aqi=no'
    }
    axios
        .request(weatherConfig)
        .then(response => {
            res.send({
                temperature: response.data.current.temp_c + ' degree celsius',
                conditionText: response.data.current.condition.text,
                conditionIcon: response.data.current.condition.icon,
                humidity: response.data.current.humidity + ' %'
            })
        })
        .catch(err => res.send({ error: err }))
})
app.get('/getTime', (req, res) => {
    const dt = new Date()
    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    const amOrPm = dt.getHours() < 12 ? ' AM' : ' PM'
    const mins = dt.getMinutes() < 10 ? '0' : ''
    res.send({
        date: dt.getDate(),
        day: days[dt.getDay() - 1],
        month: months[dt.getMonth()],
        time: dt.getHours() + ' : ' + mins + dt.getMinutes() + amOrPm
    })
})

app.get('/getFacts', (req, res) => {
    const foodRequest = {
        method: 'GET',
        url: 'https://www.indexofsciences.com/index.php/wp-json/wp/v2/posts'
    }
    axios.request(foodRequest).then(data => {
        let range = data.data.length - 1
        let index = Math.floor(range * Math.random())
        res.send({
            fact: data.data[index].content.rendered
        })
    })
})
app.post('/bmi', (req, res) => {
    const weight = Number(req.body.weightInKG)
    const height = Number(req.body.heightInCM) / 100
    const bmi = weight / (height * height)

    let range = ''

    if (bmi < 15) range = 'Very severely underweight'
    else if (bmi > 15 && bmi < 16) range = 'Severely underweight'
    else if (bmi > 16 && bmi < 18.5) range = 'Underweight'
    else if (bmi > 18.5 && bmi < 25) range = 'Normal (healthy weight)'
    else if (bmi > 25 && bmi < 30) range = 'Overweight'
    else if (bmi > 30 && bmi < 35) range = 'Obese Class I (Moderately obese)'
    else if (bmi > 35 && bmi < 40) range = 'Obese Class II (Severly obese)'
    else if (bmi > 40) range = 'Obese Class III (Very Severly obese)'

    res.send({
        bmi: bmi,
        range: range
    })
})
app.listen(3000, () => {
    console.log(`http://${hostname}:${port}`)
})