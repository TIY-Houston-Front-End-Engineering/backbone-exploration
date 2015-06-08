"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/register")
var backbone = require('backbone')
var Promise = require('es6-promise').Promise

window.backbone = backbone
window.$ = backbone.$
window._ = require("underscore")

var key = `d353c94884828ab143c8633437f899aa`

window.Forecast = backbone.Model.extend({
    defaults: {
        key: key
    },

    validate: function(attrs) {
        if (!attrs.lat || !attrs.lng) return "No lat/lng provided."
    },

    initialize: function(){
        this.on("request", () => {
            console.log('requesting data')
        })
        this.on("sync", () => {
            console.log('request finished')
        })
        this.on("error", (...args) => {
            console.error(args)
        })
    },

    urlRoot: function(){
        return `https://api.forecast.io/forecast/${this.get('key')}/${this.get('lat')},${this.get('lng')}?callback=?`
    }
})

var forecast_html = (forecastJSON) => `<div>
    <p>${forecastJSON.currently.temperature}</p>
    <span>${new Date().toLocaleTimeString()}</span>
</div>`

var f = new Forecast({lat:26, lng: -90})

f.on('sync', function(model){
    document.body.innerHTML = forecast_html(model.toJSON())
})

setInterval(() => {
    f.fetch()
}, 5*1000)

f.fetch()









