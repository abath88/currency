const express = require('express')
const https = require('https')
const app = express()

app.get('/', (req, res) => {
    let message = '<html><body><p>/exchange - show USD, EUR, GBP</p><p>/exchange/:from/:howmuch - exchange :howmuch to zł :from currency</p></body></html'
    res.status(200)
    res.send(message)
})

app.get('/exchange', (req, res) => {
    https.get('https://api.nbp.pl/api/exchangerates/tables/a/today/?format=json', resp => {
        let data = ''
        resp.on('data', (chunk) => { data += chunk })
        resp.on('end', () => {
            try {
                if ( resp.statusCode != 200) {
                    res.status(200)
                    res.send({ "error code": resp.statusCode, "error message": resp.statusMessage })
                }
                data = JSON.parse(data)
                res.status(200)
                res.send(data[0].rates.filter( o => (o.code == 'USD' || o.code == 'EUR' || o.code == 'GBP')))
            } catch (error) {
                res.status(500)
                res.send(error.message)
            }
        })
    })
})

app.get('/exchange/:from/:howmuch', (req, res) => {
    https.get('https://api.nbp.pl/api/exchangerates/rates/c/' + req.params.from + '/today/', resp => {
        let data = ''
        resp.on('data', (chunk) => { data += chunk })
        resp.on('end', () => {
            try {
                if ( resp.statusCode != 200) {
                    res.status(200)
                    res.send({ "error code": resp.statusCode, "error message": resp.statusMessage })
                }
                data = JSON.parse(data)
                let zl = data.rates[0].bid * req.params.howmuch
                res.status(200)
                res.send({"zł": zl.toFixed(2)})
            } catch (error) {
                res.status(500)
                res.send({"err": error.message})
            }
        })
    })
})

app.listen(3000, () => {console.log("-- server listen at port 3000")})