const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode  = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars enginne and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static diredctory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index',{
        title:'Weather',
        name:'Siddhant Thakur'
    })
})

app.get('/about',(req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Siddhant Thakur'
    })
})

app.get('/help',(req,res) => {
    res.render('help', {
        title:'Help',
        name:'Siddhant Thakur'
    })
})

app.get('/weather',(req,res) => {
    if(!req.query.address){
        return res.send({
            error:'You must provide an address'
        })
    }   

    geocode(req.query.address,(error, { latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error}) 
        }

        forecast(latitude, longitude , (error ,forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })

    // res.send({
    //     forecast:'It is sunny',
    //     location: 'New Delhi',
    //     address: req.query.address

    // })
})

app.get('/products',(req, res) => {
    if(!req.query.search){
       return res.send({
            error:'You must provide a search term'
        })
    }

    console.log(req.query.search);
    res.send({
        product:[]
    })
})

app.get('/help/*',(req,res) => {
    res.render('404',{
        title:'404',
        name:'Siddhant',
        errorMessage:'Help article not found'
    })
})

app.get('*',(req, res) => {
    res.render('404',{
        title:'404',
        name:'Siddhant',
        errorMessage:'Page Not Found'
    })
})

app.listen(port, () => {
    console.log('Server is up in port:' + port)
})