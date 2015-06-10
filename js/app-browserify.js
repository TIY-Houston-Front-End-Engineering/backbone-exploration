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

var f = new Forecast({lat:26, lng: -90})

var ForecastView = backbone.View.extend({
    el: '.container',
    events: {
        "click": "alert1",
        "click a": "alert2"
    },
    alert1: function(){
        alert(1)
    },
    alert2: function(){
        alert(2)
    },
    template: (forecastJSON) => `<div>
        <p>${forecastJSON.currently.temperature}</p>
        <span>${new Date().toLocaleTimeString()}</span>
    </div>`,
    render: function(data){
        this.el.innerHTML = this.template(data)
    },
    initialize: function(){
        this.listenTo(this.model, "sync", function(m){
            this.render(m.toJSON())
        })
    }
})

// window.x = new ForecastView({
//     model: f
// })

// setInterval(() => {
//     f.fetch()
// }, 5*1000)

// f.fetch()









































var etsy_key = `aavnvygu0h5r52qes74x9zvo`,
    etsy_url = (id) => `https://openapi.etsy.com/v2/listings/${id}.js?api_key=${etsy_key}&includes=Images&callback=?`

var EtsyModel = backbone.Model.extend({
    initialize: function(){

    },
    url: function(){
        return etsy_url(this.id)
    }
})

var EtsyCollection = backbone.Collection.extend({
    model: EtsyModel,
    initialize: function(){

    },
    url: etsy_url('active'),
    parse: function(json){
        return json.results
    }
})

var active_listings = new EtsyCollection()

// View

var ActiveListingsView = backbone.View.extend({
    el: '.container',
    initialize: function(){
        this.listenTo(this.collection, "sync", this.render)
        this.listenTo(this.collection, "request", this.loader)
    },
    events: {
        "click a": "removeListing"
    },
    removeListing: function(e){
        backbone.trigger("itemClicked", e)
    },
    loader: function(){
        this.el.innerHTML = "<p>... loading</p>"
    },
    template: (array) => `
    <div class="grid grid-2-400 grid-4-800">
        ${array.map((obj) => {
            return `
            <a href="#">
                <img src="${obj.Images[0].url_570xN}">
                <h5>${obj.title}</h5>
            </a>
            `
        }).join(' ')}
    <div>`,
    render: function(){
        var json = this.collection.toJSON()
        this.el.innerHTML = this.template(json)
    }
})

backbone.on("itemClicked", (data) => console.log(data))

var active_listings_view = new ActiveListingsView({ collection: active_listings })






// start grabbing data from ETSY

active_listings.fetch()

