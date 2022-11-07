import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'

type Props = {}

function Quality({}: Props) {
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
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
    })
  }, [url])

  return (
    <>
      <div>
        <input id="file" type="file" onChange={(e => onUploadFile(e))}></input>
      </div>
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  )
}

export default Quality