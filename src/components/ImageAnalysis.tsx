import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'

type Props = {}

function ImageAnalysis({}: Props) {
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [pixelsData, setPixelsData] = useState<number[][]>([])
  const [pixelsGrayscale, setPixelsGrayscale] = useState<number[][]>([])
  const [pixelsDataMatrix, setPixelsDataMatrix] = useState<number[][][]>([])
  const [url, setUrl] = useState<string>('')
  const [redPercent, setRedPercent] = useState(0)
  const [greenPercent, setGreenPercent] = useState(0)
  const [bluePercent, setBluePercent] = useState(0)
  const [otherPercent, setOtherPercent] = useState(0)

  const percentRound = (val: number) => Math.round(val * 100) / 100

  const rgbToHsv = (pixel: number[]) => {
    let h = 0, s = 0, v = 0
    const r = pixel[0] / 255
    const g = pixel[1] / 255
    const b = pixel[2] / 255
    const cmax = Math.max(r, g, b)
    v = cmax
    const delta = cmax - Math.min(r, g, b)

    if (delta == 0) {
      return {h: 0, s: 0, v: v}
    }
    s = delta / cmax
    if(cmax === r) {
      h = Math.round(60 * (((g - b) / delta) % 6))
    } 
    else if(cmax === g) {
      h = Math.round(60 * (((b - r) / delta) + 2))
    }
    else if(cmax === b) {
      h = Math.round(60 * (((r - g) / delta) + 4))
    }
    return {
        h: h,
        s: percentRound(s * 100),
        v: percentRound(v * 100)
    };
  }

  const colorPercent = () => {
    let red = 0, green = 0, blue = 0, other = 0

    for(let i = 0; i < pixelsData.length; i++) {
      let hsv = rgbToHsv(pixelsData[i])
      if((hsv.h >= 0 && hsv.h <= 33) || (hsv.h >= 340 && hsv.h <= 360)) {
        red++
      }
      if(hsv.h >= 74 && hsv.h <= 161) {
        green++
      }
      else if(hsv.h >= 175 && hsv.h <= 265) {
        blue++
      }
      else {
        other++
      }
    }
    setRedPercent(percentRound(red / pixelsData.length * 100))
    setGreenPercent(percentRound(green / pixelsData.length * 100))
    setBluePercent(percentRound(blue / pixelsData.length * 100))
    setOtherPercent(percentRound(other / pixelsData.length * 100))
  }

  const onUploadFile = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0]
    setUploadedImage(file)
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
        <button onClick={colorPercent}>Calculate percentages</button>
      </div>
      <div>red percent: {redPercent}</div>
      <div>green percent: {greenPercent}</div>
      <div>blue percent: {bluePercent}</div>
      <div>other percent: {otherPercent}</div>
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  )
}

export default ImageAnalysis