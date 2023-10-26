// index.js
import HttpClient from "/App/App.js"

const httpClient = new HttpClient()
document.querySelectorAll('nav').forEach(el => {
    el.addEventListener('click', (event) => {
        event.preventDefault()
        let href = event.target.getAttribute('href')

        if(!href) return

        else if(href == window.location.pathname) {
            return
        }

        httpClient.navigateTo(event.target.getAttribute('href'))
    })
})