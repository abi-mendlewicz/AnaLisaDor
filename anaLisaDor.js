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
const lmoN = document.getElementById('lmoN')
const ol15N = document.getElementById('ol15N')
const lmpN = document.getElementById('lmpN')
const pl6N = document.getElementById('pl6N')
const pfN = document.getElementById('pfN')
const suma = document.getElementById('suma')
const c = document.getElementById('c')
const idl = document.getElementById('idl')
const detail = document.getElementById('detail')

submitButton.addEventListener('click', () => {
  detail.innerHTML = '<h2 class="mt-4 text-xl">Detalle</h2>'
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
  let min9Letras = 0
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

        if (palabraLimpia.length >= 9) {
          min9Letras ++
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

        if (palabra.length >= 9) {
          d += '<span class="ms-1 bg-red-400">>=9</span>'
        } else if (palabra.length > 6) {
          d += '<span class="ms-1 bg-red-200">7-8</span>'
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
  tPf.innerText = min9Letras
  tLetras.innerText = totalLetras

  // Render métricas
  const decimalOpts = {
    style: 'decimal',
    maximumFractionDigits: 3,
  }
  const percentOpts = {
    style: 'percent',
    maximumFractionDigits: 3,
  }

  const metrics = {
    lmo: (totalPalabras / totalFrases),
    ol15: (max15Palabras / totalFrases),
    lmp: (totalLetras / totalPalabras),
    pl78: (max6Letras / totalPalabras),
    plRare: (min9Letras / totalPalabras),
  }

  const weights = {
    lmo: 1,
    ol15: 1.2,
    lmp: 1,
    pl78: 1,
    plRare: 1.5,
  }
  
  lmo.innerText = metrics.lmo.toLocaleString('es', decimalOpts)
  ol15.innerText = metrics.ol15.toLocaleString('es', percentOpts)
  lmp.innerText = metrics.lmp.toLocaleString('es', decimalOpts)
  pl6.innerText = metrics.pl78.toLocaleString('es', percentOpts)
  pf.innerText = metrics.plRare.toLocaleString('es', percentOpts)

  // Calcular fórmula


  // Normalización
  const lmoNormalized = Math.min(1, metrics.lmo / 20)
  const ol15Normalized = metrics.ol15
  const lmpNormalized = Math.min(1, metrics.lmp / 8)
  const pl78Normalized = metrics.pl78
  const plRareNormalized = metrics.plRare

  // Render métricas normalizadas
  lmoN.innerText = lmoNormalized.toLocaleString('es', decimalOpts)
  ol15N.innerText = ol15Normalized.toLocaleString('es', percentOpts)
  lmpN.innerText = lmpNormalized.toLocaleString('es', decimalOpts)
  pl6N.innerText = pl78Normalized.toLocaleString('es', percentOpts)
  pfN.innerText = plRareNormalized.toLocaleString('es', percentOpts)

  // Suma ponderada e IDL
  const sum =
    weights.lmo * lmoNormalized +
    weights.ol15 * ol15Normalized +
    weights.lmp * lmpNormalized +
    weights.pl78 * pl78Normalized +
    weights.plRare * plRareNormalized

  const tope = 3.6

  suma.innerText = `${weights.lmo} * ${lmoNormalized} + ${weights.ol15} * ${ol15Normalized} + ${weights.lmp} * ${lmpNormalized} + ${weights.pl78} * ${pl78Normalized} + ${weights.plRare} * ${plRareNormalized} = ${sum.toLocaleString('es', decimalOpts)}`
  c.innerText = tope.toLocaleString('es', decimalOpts)

  const res = 100 * Math.min(1, (tope > 0 ? (sum / tope) : 0))

  idl.innerText = res
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
  suma.innerText = ''
  c.innerText = ''
  idl.innerText = ''
  detail.innerHTML = '<h2 class="mt-4 text-xl">Detalle</h2>'
})