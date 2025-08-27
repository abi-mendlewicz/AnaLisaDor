import { ABREVIATURAS } from './abreviaturas.mjs'

console.log('Analizando...')
const textContainer = document.getElementById('text')
const submitButton = document.getElementById('submitButton')
const clearTextButton = document.getElementById('clearTextButton')
const tFrases = document.getElementById('totalFrases')
const tOl15 = document.getElementById('totalOl15')
const tPalabras = document.getElementById('totalPalabras')
const tPl6 = document.getElementById('totalPl6')
const tPf = document.getElementById('totalPf')
const tLetras = document.getElementById('totalLetras')
const lmo = document.getElementById('lmo')
const ol15 = document.getElementById('ol15')
const lmp = document.getElementById('lmp')
const pl6 = document.getElementById('pl6')
const pf = document.getElementById('pf')
const detail = document.getElementById('detail')

submitButton.addEventListener('click', () => {
  const texto = textContainer.value
  const textoDesabreviado = texto.replace(new RegExp(`${ABREVIATURAS.map(abv => RegExp.escape(abv)).join('|')}`, 'gi'), match => match.replace('.', ''))
  console.log('texto:', texto)
  console.log(new RegExp(`${ABREVIATURAS.map(abv => RegExp.escape(abv)).join('|')}`, 'gi'))
  console.log('textoDesabreviado:', textoDesabreviado)
  const reFrase = /[.!?]\s+|\s{2,}|\n|\r\n|\\x0C/
  const frases = textoDesabreviado.split(reFrase).filter(frase => frase)
  let totalFrases = 0
  let totalPalabras = 0
  let totalLetras = 0
  let max15Palabras = 0
  let max8Letras = 0
  let max6Letras = 0

  frases.forEach((frase, i) => {
    console.log(frase)
    const fraseLimpia = []
    const palabras = frase.split(/\s|-/)

    palabras.forEach(palabra => {
      const palabraLimpia = palabra.replace(/[^a-zñáéíóúü]/gi, '')
      
      if (palabraLimpia) {
        totalPalabras ++
        totalLetras += palabraLimpia.length

        if (palabraLimpia.length >= 8) {
          max8Letras ++
        } else if (palabraLimpia.length > 6) {
          max6Letras ++
        }

        fraseLimpia.push(palabraLimpia)
      }
    })

    if (fraseLimpia.length) {
      totalFrases ++

      const h3 = document.createElement('h3')

      h3.className = 'font-semibold'
      h3.innerHTML = `Frese #${i + 1} - ${fraseLimpia.length} palabra${fraseLimpia.length > 1 ? 's' : ''} ${fraseLimpia.length > 14 ? '<span class="ms-1 bg-red-600">>=15</span>' : ''}` 
      detail.append(h3)

      fraseLimpia.forEach(palabra => {
        const p = document.createElement('p')
        let d = `${palabra}: ${palabra.length} letra${palabra.length > 1 ? 's' : ''}`

        if (palabra.length >= 8) {
          d += '<span class="ms-1 bg-red-400">>=8</span>'
        } else if (palabra.length > 6) {
          d += '<span class="ms-1 bg-red-200">>6</span>'
        }
        
        p.innerHTML = d
        detail.append(p)

      })

      if (fraseLimpia.length > 15) {
        max15Palabras ++
      }
      
      const hr = document.createElement('hr')

      hr.className = 'mt-2 mb-4'
      detail.append(hr)
    }
  })

  // Render datos generales
  tFrases.innerText = totalFrases
  tOl15.innerText = max15Palabras
  tPalabras.innerText = totalPalabras
  tPl6.innerText = max6Letras
  tPf.innerText = max8Letras
  tLetras.innerText = totalLetras

  // Render métricas
  const decimalOpts = {
    style: 'decimal',
    maximumFractionDigits: 2,
  }
  const percentOpts = {
    style: 'percent',
    maximumFractionDigits: 2,
  }
  
  lmo.innerText = (totalPalabras / totalFrases).toLocaleString('es', decimalOpts)
  ol15.innerText = (max15Palabras / totalFrases).toLocaleString('es', percentOpts)
  lmp.innerText = (totalLetras / totalPalabras).toLocaleString('es', decimalOpts)
  pl6.innerText = (max6Letras / totalPalabras).toLocaleString('es', percentOpts)
  pf.innerText = (max8Letras / totalPalabras).toLocaleString('es', percentOpts)
})

clearTextButton.addEventListener('click', () => {
  textContainer.value = ''
  tFrases.innerText = ''
  tOl15.innerText = ''
  tPalabras.innerText = ''
  tPl6.innerText = ''
  tPf.innerText = ''
  tLetras.innerText = ''
  lmo.innerText = ''
  ol15.innerText = ''
  lmp.innerText = ''
  pl6.innerText = ''
  pf.innerText = ''
})