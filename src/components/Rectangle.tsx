import React, { useState } from 'react'

type Props = {
  canvasRef: any
}

const strokeRectangle = (canvasRef: any, ax: number, ay: number, bx: number, by: number) => {
  const canvas = canvasRef.current
  const context = canvas.getContext('2d')
  context!.strokeStyle = "#000000"

  context?.beginPath()
  context.rect(ax, ay, bx, by);
  context?.stroke()
}

function Rectangle({ canvasRef }: Props) {
  const [paramAx, setParamAx] = useState(0)
  const [paramAy, setParamAy] = useState(0)
  const [paramBx, setParamBx] = useState(0)
  const [paramBy, setParamBy] = useState(0)

  return (
    <div>
      <div>rysuj prostokat</div>
      <input placeholder='punkt X' onChange={(e) => setParamAx(parseInt(e.target.value)) } />
      <input placeholder='punkt Y' onChange={(e) => setParamAy(parseInt(e.target.value)) } />
      <input placeholder='szerokosc' onChange={(e) => setParamBx(parseInt(e.target.value)) } />
      <input placeholder='wysokosc' onChange={(e) => setParamBy(parseInt(e.target.value)) } />
      <button onClick={() => strokeRectangle(canvasRef, paramAx, paramAy, paramBx, paramBy)}>rysuj</button>
    </div>
  )
}

export default Rectangle