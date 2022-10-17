import React, { useState } from 'react'

type Props = {
  canvasRef: any
}

const strokeLine = (canvasRef: any, ax: number, ay: number, bx: number, by: number) => {
  const canvas = canvasRef.current
  const context = canvas.getContext('2d')
  context!.strokeStyle = "#000000"
  context?.beginPath()
  context?.moveTo(ax, ay)
  context?.lineTo(bx, by)
  context?.stroke()
}

function Line({ canvasRef }: Props) {
  const [paramAx, setParamAx] = useState(0)
  const [paramAy, setParamAy] = useState(0)
  const [paramBx, setParamBx] = useState(0)
  const [paramBy, setParamBy] = useState(0)

  return (
    <div>
      <div>rysuj linie</div>
      <input placeholder='punkt Ax' onChange={(e) => setParamAx(parseInt(e.target.value)) } />
      <input placeholder='punkt Ay' onChange={(e) => setParamAy(parseInt(e.target.value)) } />
      <input placeholder='punkt Bx' onChange={(e) => setParamBx(parseInt(e.target.value)) } />
      <input placeholder='punkt By' onChange={(e) => setParamBy(parseInt(e.target.value)) } />
      <button onClick={() => strokeLine(canvasRef, paramAx, paramAy, paramBx, paramBy)}>rysuj</button>
    </div>
  )
}

export default Line