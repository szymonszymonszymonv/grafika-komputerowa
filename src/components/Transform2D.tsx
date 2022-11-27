import React, { useEffect, useRef, useState } from 'react'

type Props = {}

interface Point {
  x: number
  y: number
}

class Shape {
  startPoint: Point
  points: Point[]
  
  constructor(points: Point[]) {
    this.startPoint = points[0]
    this.points = points.slice(1)
  }
}

function Transform2D({}: Props) {
  const canvasRef = useRef(null)
  const [pointX, setPointX] = useState(0)
  const [pointY, setPointY] = useState(0)
  const [points, setPoints] = useState<Point[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [activeShape, setActiveShape] = useState<Shape | null>(null)

  const onAddShape = () => {
    setShapes([...shapes, new Shape(points)])
    setPoints([])
    draw()
  }

  const getBoundingShape = () => {
    const boundingShape = null 
    setActiveShape(boundingShape)
    if(boundingShape) {
      setIsMoving(true)
    }
  }

  const draw = () => {
    if(!isMoving) {
      return
    }
    
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")
    ctx!.canvas.width = 800
    ctx!.canvas.height = 600

    const onMouseDown = (e: MouseEvent) => getBoundingShape()
    const onMouseMove = (e: MouseEvent) => draw()
    // const onMouseUp = (e: MouseEvent) => endDrawing()
  }, []);

  return (
    <div>
      <div>Draw shape</div>
      <div>
        <input placeholder='x' onChange={(e) => setPointX(parseInt(e.target.value))}></input>
        <input placeholder='y' onChange={(e) => setPointY(parseInt(e.target.value))}></input>
      </div>
      <div>
        <button onClick={() => setPoints([...points, {x: pointX, y: pointY}])}>Add point</button>
        <button onClick={() => onAddShape()}>Draw shape</button>
      </div>
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default Transform2D