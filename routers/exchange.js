const API = require('express').Router()
const axios = require('axios');

const checkResponse = function (data, res) {
	if ( data.status != 200) {
		res.status(200)
		res.send({ "error code": response.status, "error message": response.statusText })
	}
}

API.get('/', async (req, res, next) => {
    axios.get('https://api.nbp.pl/api/exchangerates/tables/a/today/?format=json')
		.then(function (response) {
			try {
				checkResponse(response, res)
				const data = response.data
				res.status(200)
				res.send(data[0].rates.filter( o => (o.code == 'USD' || o.code == 'EUR' || o.code == 'GBP')))
			} catch (error) {
				res.status(500)
				res.send(error.message)
			}
		})
		.catch(function (error) {
			console.error(error)
			res.send(error)
		})
})

API.get('/:from/:howmuch', async (req, res, next) => {
    axios.get('https://api.nbp.pl/api/exchangerates/rates/c/' + req.params.from + '/today/')
		.then(function (response) {
			try {
				checkResponse(response, res)
				const data = response.data
				let zl = data.rates[0].bid * req.params.howmuch
				res.status(200)
				res.send({"zł": zl.toFixed(2)})	
			
			} catch (error) {
				res.status(500)
				res.send(error.message)
			}
		})
		.catch(function (error) {
			console.error(error)
			res.send(error)
		})
})

module.exports = API