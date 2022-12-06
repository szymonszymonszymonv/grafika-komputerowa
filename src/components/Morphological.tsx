import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'

type Props = {}

function Morphological({}: Props) {
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [pixelsData, setPixelsData] = useState<number[][]>([])
  const [pixelsGrayscale, setPixelsGrayscale] = useState<number[][]>([])
  const [pixelsDataMatrix, setPixelsDataMatrix] = useState<number[][][]>([])
  const [url, setUrl] = useState<string>('')



  const onUploadFile = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0]
    setUploadedImage(file)
    console.log(file)
    setUrl(URL.createObjectURL(file))
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
      
      const pixelsData = imageData.data.reduce((row: any, val: any, idx) => {
        return (idx % 4 === 0 ? row.push([val]) : row[row.length - 1].push(val)) && row
      }, [] as number[][])
      setPixelsData(pixelsData)

      const pixelsGrayscale = pixelsData.map((pixel: number[]) => {
        const avg = Math.round((pixel[0] + pixel[1] + pixel[2]) / 3)
        return [avg, avg, avg, 255]
      })
      setPixelsGrayscale(pixelsGrayscale)

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
        <button onClick={() => {}}>dilation</button>
        <button onClick={() => {}}>erosion</button>
        <button onClick={() => {}}>opening</button>
        <button onClick={() => {}}>closing</button>
        <button onClick={() => {}}>hit-or-miss</button>
      </div>
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  )
}


export default Morphological