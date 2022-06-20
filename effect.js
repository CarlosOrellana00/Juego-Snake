// constantes de escenario
const columnas = 40
const filas = 30
const lado = 20
const ancho_canvas = columnas * lado
const alto_canvas = filas * lado

// variables de escenario
let serpiente
let comida

// variables de control
let arriba
let derecha
let izquierda
let abajo

// variables de entorno html
let canvas

function setup() {
  frameRate(10)
  canvas = createCanvas(ancho_canvas, alto_canvas)
  windowResized()
  serpiente = new Serpiente()
  posicionarComida()
  arriba = createVector(0, -1)
  abajo = createVector(0, 1)
  derecha = createVector(1, 0)
  izquierda = createVector(-1, 0)
}
// ajustar tamaño de pagina a escala
function windowResized() {
  let escala = windowWidth / width
  if (escala >= 1) {
    return
  }
  canvas.style("width", width * escala + "px")
  canvas.style("height", height * escala + "px")
}
// vista en pantalla
function draw() {
  background("black")
  serpiente.dibujar()
  // comida
  fill("crimson")
  rect(comida.x * lado, comida.y * lado, lado, lado)
  if (serpiente.posicion.dist(comida) == 0) {
    serpiente.tamaño++
    posicionarComida()
  }
}
// Movimiento por teclas
function keyPressed() {
  // Reinicio
  if (!isLooping()) {
    juegoNuevo()
  }
  // movimiento flechas
  switch (keyCode) {
    case UP_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == abajo) {
        break
      }
      serpiente.aceleracion = arriba
      break;
    case RIGHT_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == izquierda) {
        break
      }
      serpiente.aceleracion = derecha
      break;
    case DOWN_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == arriba) {
        break
      }
      serpiente.aceleracion = abajo
      break;
    case LEFT_ARROW:
      if (serpiente.cola.length && serpiente.aceleracion == derecha) {
        break
      }
      serpiente.aceleracion = izquierda
      break;
    default:
      break;
  }
}

function posicionarComida() {
  comida = createVector(
    int(random(columnas)),
    int(random(filas))
  )
}

function juegoNuevo() {
  serpiente = new Serpiente()
  loop()
}

function juegoTerminado() {
  if (serpiente.sistemaDeChoques()) {
    textAlign(CENTER, CENTER)
    textSize(50)
    text("Juego terminado", width / 2, height / 2)
    noLoop()
  }
}

function Serpiente() {
  this.posicion = createVector(
    columnas / 2,
    filas / 2
  )
  this.aceleracion = createVector()
  this.cola = []
  this.tamaño = 0
  // colicion
  this.sistemaDeChoques = function() {
    if (this.posicion.x < 0 || this.posicion.y < 0) {
      return true
    }
    if (this.posicion.x >= columnas || this.posicion.y >= filas) {
      return true
    }
    // colicion con la cola
    for (const c of this.cola) {
      if (this.posicion.equals(c)) {
        return true
      }
    }
    return false
  }
  // colicion con los bordes
  this.dibujar = function() {
    fill("white")
    rect(
      constrain(this.posicion.x, 0, columnas - 1) * lado,
      constrain(this.posicion.y, 0, filas - 1) * lado,
      lado,
      lado
    )
    // dibujar cola
    for (const c of this.cola) {
      rect(
        constrain(c.x, 0, columnas - 1) * lado,
        constrain(c.y, 0, filas - 1) * lado,
        lado,
        lado
      )
    }
    juegoTerminado()
    // cola de serpiente
    this.cola.push(this.posicion.copy())
    if (this.cola.length > this.tamaño) {
      this.cola.splice(0, 1)
    }
    this.posicion.add(this.aceleracion)
  }
}
