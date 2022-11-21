import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'

type Props = {}

const generateAdjacents = (size: number) => {
  let adjacents = []
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      if(i - Math.round(size / 2) + 1 === 0 && j - Math.round(size / 2) + 1 == 0) {
        continue
      }
      adjacents.push([i - Math.round(size / 2) + 1, j - Math.round(size / 2) + 1])
    }
  }
  return adjacents
}

function Quality({}: Props) {
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [pixelsDataMatrix, setPixelsDataMatrix] = useState<number[][][]>([])
  const [url, setUrl] = useState<string>('')

  const onUploadFile = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0]
    setUploadedImage(file)
    console.log(file)
    setUrl(URL.createObjectURL(file))
  }

  const smooth = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    const bounding = canvas.getBoundingClientRect()
    const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
    // 3x3
    const adjacents = generateAdjacents(3)

    for(let i = 0; i < bounding.height; i++) {
      for(let j = 0; j < bounding.width; j++) {
        let values: number[][] = []
        values.push(pixelsDataMatrix[i][j])
        for(let adjacent of adjacents) {
          if(i + adjacent[0] < 0 || i + adjacent[0] >= bounding.height || j + adjacent[1] < 0 || j + adjacent[1] >= bounding.width) {
            // skip if out of bounds
            continue
          }
          values.push(pixelsDataMatrix[i + adjacent[0]][j + adjacent[1]])
        }
        let averagePixel = values.reduce((accumulator: number[], current: number[]) => {
          return [
            accumulator[0] + current[0],
            accumulator[1] + current[1],
            accumulator[2] + current[2],
            accumulator[3] + current[3]
          ]
        })
        averagePixel = [averagePixel[0] / values.length, averagePixel[1] / values.length, averagePixel[2] / values.length, averagePixel[3] / values.length]
        pixelsDataMatrix[i][j] = averagePixel
      }
    }
    for(let i = 0; i < pixelsDataMatrix.length; i++) {
      for(let j = 0; j < pixelsDataMatrix[i].length; j++) {
        let newPixel = pixelsDataMatrix[i][j]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4] = newPixel[0]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 1] = newPixel[1]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 2] = newPixel[2]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 3] = newPixel[3]
      }
    }
    ctx?.putImageData(imageData, 0, 0)
  }

  const median = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    const bounding = canvas.getBoundingClientRect()
    const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
    // const adjacents = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    const adjacents = generateAdjacents(3)
    console.log(adjacents)

    for(let i = 0; i < bounding.height; i++) {
      for(let j = 0; j < bounding.width; j++) {
        let values: number[][] = []
        values.push(pixelsDataMatrix[i][j])
        for(let adjacent of adjacents) {
          if(i + adjacent[0] < 0 || i + adjacent[0] >= bounding.height || j + adjacent[1] < 0 || j + adjacent[1] >= bounding.width) {
            // skip if out of bounds
            continue
          }
          values.push(pixelsDataMatrix[i + adjacent[0]][j + adjacent[1]])
        }
        let reds = values.map(pixel => pixel[0]).sort((a, b) => a - b)
        let greens = values.map(pixel => pixel[1]).sort((a, b) => a - b)
        let blues = values.map(pixel => pixel[2]).sort((a, b) => a - b)
        let alphas = values.map(pixel => pixel[3]).sort((a, b) => a - b)
        let medianRed = reds.length % 2 === 1 ? reds[Math.round(reds.length / 2)] : (reds[reds.length / 2 - 1] + reds[reds.length / 2]) / 2
        let medianGreen = blues.length % 2 === 1 ? blues[Math.round(blues.length / 2)] : (blues[blues.length / 2 - 1] + blues[blues.length / 2]) / 2
        let medianBlue = greens.length % 2 === 1 ? greens[Math.round(greens.length / 2)] : (greens[greens.length / 2 - 1] + greens[greens.length / 2]) / 2
        let medianAlpha = alphas.length % 2 === 1 ? alphas[Math.round(alphas.length / 2)] : (alphas[alphas.length / 2 - 1] + alphas[alphas.length / 2]) / 2
        const averagePixel = [medianRed, medianGreen, medianBlue, medianAlpha]
        pixelsDataMatrix[i][j] = averagePixel
        // debugger;
      }
    }
    for(let i = 0; i < pixelsDataMatrix.length; i++) {
      for(let j = 0; j < pixelsDataMatrix[i].length; j++) {
        let newPixel = pixelsDataMatrix[i][j]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4] = newPixel[0]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 1] = newPixel[1]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 2] = newPixel[2]
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 3] = newPixel[3]
      }
    }
    ctx?.putImageData(imageData, 0, 0)

  }

  const sobel = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    const bounding = canvas.getBoundingClientRect()
    const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
    // const adjacents = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    const adjacents = generateAdjacents(3)

    const maskX = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ]
    const maskY = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ]

    let pixelsGrayscale: number[][][] = []
    for(let i = 0; i < bounding.height; i++) {
      pixelsGrayscale.push([])
      for(let j = 0; j < bounding.width; j++) {
        let r = pixelsDataMatrix[i][j][0]
        let g = pixelsDataMatrix[i][j][1]
        let b = pixelsDataMatrix[i][j][2]
        let avg = (r + g + b) / 3
        pixelsGrayscale[i].push([avg, avg, avg, 255])
      }
    }
    for(let i = 0; i < bounding.height; i++) {
      for(let j = 0; j < bounding.width; j++) {
        let pixelX = 0
        let pixelY = 0
        // for(let k = 0; k < adjacents.length; k++) {
        //   if(i + adjacents[k][0] < 0 || i + adjacents[k][0] >= bounding.height || j + adjacents[k][1] < 0 || j + adjacents[k][1] >= bounding.width) {
        //     continue
        //   }
        //   pixelX += maskX[Math.floor((k+1)/3)][k%3] * pixelsGrayscale[i+adjacents[k][0]][j+adjacents[k][1]][0]
        //   pixelY += maskY[Math.floor((k+1)/3)][k%3] * pixelsGrayscale[i+adjacents[k][0]][j+adjacents[k][1]][0]
        // }

        if(i > 0) {
          pixelX += maskX[0][1] * pixelsGrayscale[i - 1][j][0] ?? 0
          pixelY += maskY[0][1] * pixelsGrayscale[i - 1][j][0] ?? 0
          if(j > 0) {
            pixelX += maskX[0][0] * pixelsGrayscale[i - 1][j - 1][0] ?? 0
            pixelY += maskY[0][0] * pixelsGrayscale[i - 1][j - 1][0] ?? 0
          }
          if(j < bounding.width - 1) {
            pixelX += maskX[0][2] * pixelsGrayscale[i - 1][j + 1][0] ?? 0
            pixelY += maskY[0][2] * pixelsGrayscale[i - 1][j + 1][0] ?? 0 
          }
        }
        if(j > 0) {
          pixelX += maskX[1][0] * pixelsGrayscale[i][j - 1][0] ?? 0 
          pixelY += maskY[1][0] * pixelsGrayscale[i][j - 1][0] ?? 0 
        }
        if(j < bounding.width - 1) {
          pixelX += maskX[1][2] * pixelsGrayscale[i][j + 1][0] ?? 0 
          pixelY += maskY[1][2] * pixelsGrayscale[i][j + 1][0] ?? 0 
        }
        if(i < bounding.height - 1) {
          pixelX += maskX[2][1] * pixelsGrayscale[i + 1][j][0] ?? 0
          pixelY += maskY[2][1] * pixelsGrayscale[i + 1][j][0] ?? 0
          if(j > 0) {
            pixelX += maskX[2][0] * pixelsGrayscale[i + 1][j - 1][0] ?? 0 
            pixelY += maskY[2][0] * pixelsGrayscale[i + 1][j - 1][0] ?? 0 
          }
          if(j < bounding.width - 1) {
            pixelX += maskX[2][2] * pixelsGrayscale[i + 1][j + 1][0] ?? 0 
            pixelY += maskY[2][2] * pixelsGrayscale[i + 1][j + 1][0] ?? 0 
          }
        }

        let gradientMagnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4] =  gradientMagnitude
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 1] = gradientMagnitude
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 2] = gradientMagnitude
        imageData.data[(i * pixelsDataMatrix[i].length + j) * 4 + 3] = 255
      }
    }
    ctx?.putImageData(imageData, 0, 0)
  }

  // init canvas
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    ctx!.canvas.width = 800
    ctx!.canvas.height = 600
  }, [])

  // draw img on canvas
  useEffect(() => {
    const img = new Image()
    img.src = url
    img.addEventListener("load", () => {
      const canvas: HTMLCanvasElement = canvasRef.current!
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      const bounding = canvas.getBoundingClientRect()
      const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
      console.log(imageData)
      const pixelsData = imageData.data.reduce((row: any, val: any, idx) => {
        return (idx % 4 === 0 ? row.push([val]) : row[row.length - 1].push(val)) && row
      }, [] as number[][])
  
      const pixelsMatrix: number[][][] = []
      for(let i = 0; i < bounding.height; i++) {
        pixelsMatrix.push([])
        for(let j = 0; j < bounding.width; j++) {
          pixelsMatrix[i].push(pixelsData[i * bounding.width + j])
        }
      }
      setPixelsDataMatrix(pixelsMatrix)
    })
  }, [url])

  return (
    <>
      <div>
        <input id="file" type="file" onChange={(e => onUploadFile(e))}></input>
      </div>
      <div>
        <button onClick={smooth}>smooth</button>
        <button onClick={median}>median</button>
        <button onClick={sobel}>sobel</button>
      </div>
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  )
}

export default Quality