import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

type Props = {}

const arrayMinMax = (arr: any[]) =>
  arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]);

function Histogram({}: Props) {
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [pixelsDataGrayscale, setPixelsDataGrayscale] = useState([])
  const [chart, setChart] = useState<Chart>()
  const canvasChartRef = useRef(null)

  let chartData: number[] = Array(256)



  const onUploadFile = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0]
    setUploadedImage(file)
    console.log(file)
    setUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    const img = new Image()
    img.src = url
    img.addEventListener("load", () => {
      const canvas: HTMLCanvasElement = canvasRef.current!
      const ctx = canvas.getContext('2d')
      const chartCtx = (canvasChartRef.current! as HTMLCanvasElement).getContext('2d') 
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const bounding = canvas.getBoundingClientRect()
      const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!

      const pixelsData = imageData.data.reduce((row: any, val: any, idx) => {
        return (idx % 4 === 0 ? row.push([val]) : row[row.length - 1].push(val)) && row
      }, [] as number[][])

      const pixelsGrayscale = pixelsData.map((pixel: number[]) => {
        const avg = Math.round((pixel[0] + pixel[1] + pixel[2]) / 3)
        return [avg, avg, avg, 255]
      })
      console.log(pixelsGrayscale.length)
      console.log(imageData.data.length)

      for(let i = 0; i < pixelsGrayscale.length; i++) {
        imageData.data[i*4] = pixelsGrayscale[i][0]
        imageData.data[i*4 + 1] = pixelsGrayscale[i][0]
        imageData.data[i*4 + 2] = pixelsGrayscale[i][0]
        imageData.data[i*4 + 3] = 255
      }
      ctx?.putImageData(imageData, 0, 0)

      for(let pixel of pixelsGrayscale) {
        chartData[pixel[0]] = (chartData[pixel[0]] ?? 0) + 1
      }

      const chartConfig: Chart.ChartConfiguration = {
        type: 'bar',
        data: {
          datasets: [{
            label: "n of pixels",
            barPercentage: 1.3,
            data: chartData
          }],
          labels: [...Array(256).keys()]
        },
      }

      const chart = new Chart(chartCtx!, chartConfig as any)
      setChart(chart)
      setPixelsDataGrayscale(pixelsGrayscale)
    })
  }, [url])

  const equalizeExpansion = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    const bounding = canvas.getBoundingClientRect()
    const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
    const chartCtx = (canvasChartRef.current! as HTMLCanvasElement).getContext('2d') 
    const pixelsFlat = pixelsDataGrayscale.map(pixel => pixel[0]) 

    const [minGrayscale, maxGrayscale] = arrayMinMax(pixelsFlat)

    let equalizedPixels = pixelsDataGrayscale.map(pixel => {
      return Math.round((pixel[0] - minGrayscale) / (maxGrayscale - minGrayscale) * 256)
    })

    for(let i = 0; i < equalizedPixels.length; i++) {
      imageData.data[i*4] = equalizedPixels[i]
      imageData.data[i*4 + 1] = equalizedPixels[i]
      imageData.data[i*4 + 2] = equalizedPixels[i]
      imageData.data[i*4 + 3] = 255
    }
    ctx?.putImageData(imageData, 0, 0)

    chartData = Array(256)

    for(let pixel of equalizedPixels) {
      chartData[pixel] = (chartData[pixel] ?? 0) + 1
    }

    const chartConfig: Chart.ChartConfiguration = {
      type: 'bar',
      data: {
        datasets: [{
          label: "n of pixels",
          barPercentage: 1.3,
          data: chartData
        }],
        labels: [...Array(256).keys()]
      },
    }

    chart?.destroy()
    setChart(new Chart(chartCtx!, chartConfig as any))
    console.log(chartData)
  }

  const equalize = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')
    const bounding = canvas.getBoundingClientRect()
    const imageData: ImageData = ctx?.getImageData(0, 0, bounding.width, bounding.height)!
    const chartCtx = (canvasChartRef.current! as HTMLCanvasElement).getContext('2d') 
    const pixelsFlat = pixelsDataGrayscale.map(pixel => pixel[0]) 
    let sk = (k: number) => {
      let tmp = 0
      for(let i = 0; i <= k; i++) {
        tmp += chartData[i] / pixelsFlat.length
      }
      return tmp
    } 
    let lookUpTable = (k: number) => Math.round((sk(k) - sk(0)) / (1 - sk(0)) * 256) 

    chartData = Array(256)

    for(let pixel of pixelsFlat) {
      chartData[pixel] = (chartData[pixel] ?? 0) + 1
    }

    for(let i = 0; i < pixelsFlat.length; i++) {
      imageData.data[i*4] = lookUpTable(pixelsFlat[i])
      imageData.data[i*4 + 1] = lookUpTable(pixelsFlat[i])
      imageData.data[i*4 + 2] = lookUpTable(pixelsFlat[i])
      imageData.data[i*4 + 3] = 255
    }

    for(let pixel of pixelsFlat) {
      chartData[lookUpTable(pixel)] = (chartData[lookUpTable(pixel)] ?? 0) + 1
    }

    const chartConfig: Chart.ChartConfiguration = {
      type: 'bar',
      data: {
        datasets: [{
          label: "n of pixels",
          barPercentage: 1.3,
          data: chartData
        }],
        labels: [...Array(256).keys()]
      },
    }
    
    ctx?.putImageData(imageData, 0, 0)
    chart?.destroy()
    setChart(new Chart(chartCtx!, chartConfig as any))

  }

  return (
    <>
      <div>
        <input id="file" type="file" onChange={(e => onUploadFile(e))}></input>
      </div>
      <div>
        <button onClick={equalizeExpansion}>rozszerzenie</button>
        <button onClick={equalize}>wyrownanie</button>
      </div>
      <div>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={canvasChartRef}></canvas>
      </div>
      halo
    </>
  )
}

export default Histogram