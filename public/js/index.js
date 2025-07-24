import info from "./data.json" with { type: 'json' }
const container = document.querySelector(".services__services")
const inputs = document.querySelectorAll(".services__form input")
const select = document.getElementById("select")
const form = document.querySelector(".contact__form")

const data = info.data
let loading = false

function filterServices (values){
    container.innerHTML = ""
    let fragment = document.createDocumentFragment()

    values.forEach((res,i) => 
        fragment.appendChild(
            createCard({...res,id:i}) 
        )
    )

    container.appendChild(fragment)
}

inputs.forEach(input => {
    input.addEventListener("input", e =>{
        const value = e.target.value
        const results = data.filter(res => res.service == value)
        filterServices(results)
    })
});


function createCard ({name, price, description, src,id}){
    const article = document.createElement('article')
    article.classList.add("services__service")
    article.setAttribute("style",`--time:${id/10}s`)

    const img = document.createElement("img")
    img.classList.add("service__img")
    img.setAttribute("src",src)
    img.setAttribute("alt",name)

    const textBox = document.createElement("div")
    textBox.classList.add("service__textbox")

    const info = document.createElement("div")
    info.classList.add("service__info")
    const h4 = document.createElement("h4")
    h4.textContent = name
    const strong = document.createElement("strong")
    strong.textContent = price

    info.appendChild(h4)
    info.appendChild(strong)

    const p = document.createElement("p")
    p.classList.add("service__description")
    p.textContent = description

    textBox.appendChild(info)
    textBox.appendChild(p)

    article.appendChild(img)
    article.appendChild(textBox)

    article.addEventListener("click", e => {
        const hijos = Object.values(select.children)
        // eliminar el primer value vacio
        hijos.shift()
        const values = hijos.filter(res => res.getAttribute("value") == name)
        values[0].setAttribute("selected",true)
        const position = (window.scrollY + form.getBoundingClientRect().y) - 80
        window.scroll(0,position)
    })


    return article
}

// Esto es para mostrar la data principal
const results = data.filter(res => res.service == "facial" )
filterServices(results)


// Logica del select

const fragment = document.createDocumentFragment()
data.forEach(res => {
    console.log(res.name)
    const option = document.createElement("option")
    option.setAttribute("value",res.name)
    option.textContent = res.name
    fragment.appendChild(option)
})

select.appendChild(fragment)


// Logica form

form.addEventListener("submit", e =>{
    e.preventDefault()

    if (loading) return null
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    if (data.name.length < 3) return alert("El nombre debe de tener un minimo de 3 caracteres")
    else if (data.name.length > 200) return alert("Nombre demaciado largo")
    else if (data.name.includes(0,1,2,3,4,5,6,7,8,9)) return alert("los nombres no pueden poseer numeros")
    else if (data.number.length < 10) return alert("el numero telefonico esta incompleto")
    else if (data.number.length > 11) return alert("posee demaciados numeros")
    else if (!data.service) return alert("Debe seleccionar un servicio")
    else if (!data.date) return alert("Debe seleccionar un horario")

    const uri = "http://localhost:3000"

    const body = {
        name: data.name,
        number: data.number,
        service: data.service,
        date: data.date
    }

    const options = {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(body)
    }

    loading = true

    fetch(uri,options)
    .then(res => res.json())
    .then(res => alert(res.message))
    .catch(err => console.log(err))

    loading=false
})