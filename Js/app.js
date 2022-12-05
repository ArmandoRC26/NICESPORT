//const = content = null;

//accedemos al id
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')

//template
const templateCard = document.getElementById('template-card').content  //.content para acceder a los elementos 
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

//fragment para todas las cosas a pintar / como memoria volatil
const fragment = document.createDocumentFragment()
//para la operacion de agregar al carrito en el if
let carrito = {}

//addEventListener espera que se lea html y ejecuta la función
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    //localstorage para cuando recarga la pagina no desaparezcan productos en carrito
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
//al hcer clic al boton comprar
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

/*con esto leemos productos.json*/
/*Para ello usamos fetch*/
const fetchData = async () => {
    try {
        const res = await fetch('Js/productos.json') //esperar a que se lea el .json. Debemos usar fetch pero como usamos await ponemos await
        const data = await res.json() //datos/array
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

//pintamos la información
const pintarCards = data => {
    //console.log(data)
    data.forEach(producto => {
        //console.log(producto)
        templateCard.querySelector('h5').textContent = producto.title //accedemos al producto
        templateCard.querySelector('p').textContent = producto.precio //accedemos al precio
        templateCard.querySelector('img').setAttribute("src", producto.image) //accedemos a la img
        templateCard.querySelector('.btn-carrito').dataset.id = producto.id //id del producto
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-carrito'))
    if (e.target.classList.contains('btn-carrito')) {
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()//detener cualquier otro evento que se pueda generar en cards
}
//hara todo lo que seleccionemos
const setCarrito = objeto =>{
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-carrito').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }//si el producto existe: entonces aumentar cantidad
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    //empujar al carrito
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad//porque accedera a todos lo td en su segundo elemento. en un array el primero = 0
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFoother()

    //guardar en el localS
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFoother = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">| CARRITO VACÍO | Agrega algo </th>`

        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e =>{
    //e.target
    //accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        //carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1 //producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad-- //simplificado

        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}