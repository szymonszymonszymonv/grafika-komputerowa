import React, { useEffect, useRef, useState } from 'react'

type Props = {}

interface Point {
  x: number
  y: number
}

class Shape {
  points: Point[]
  
  constructor(points: Point[]) {
    this.points = points
  }
}

function Transform2D({}: Props) {
  const canvasRef = useRef(null)
  const [pointX, setPointX] = useState(0)
  const [pointY, setPointY] = useState(0)
  const [draggingX, setDraggingX] = useState(0)
  const [draggingY, setDraggingY] = useState(0)
  const [vectorX, setVectorX] = useState(0)
  const [vectorY, setVectorY] = useState(0)
  const [points, setPoints] = useState<Point[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [activeShape, setActiveShape] = useState<Shape | null>(null)
  const [modifiedShape, setModifiedShape] = useState<Shape | null>(null)

  const onAddShape = () => {
    const newShapes = [...shapes, new Shape([...points])]
    setShapes([...newShapes])
    setPoints([])
    // draw(null)
  }

  const getBoundingShape = (e: MouseEvent) => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let mouseX = e.clientX - canvas.offsetLeft
    let mouseY = e.clientY - canvas.offsetTop
    console.log(mouseX, mouseY)
    let intersects = false
    let boundingShape = null

    for(let shape of shapes) {
      let pointsLen = shape.points.length
      for(let i = 0, j = pointsLen - 1; i < pointsLen; j = i++) {
        if(((shape.points[i].y > mouseY) != (shape.points[j].y > mouseY))
          && mouseX < (shape.points[j].x - shape.points[i].x) * (mouseY - shape.points[i].y) / (shape.points[j].y - shape.points[i].y) + shape.points[i].x) {
            intersects = !intersects
          }
      }
      if(intersects) { 
        setActiveShape(shape)
        setDraggingX(mouseX)
        setDraggingY(mouseY)
        setIsMoving(true)
        return
      }
    }
  }

  const draw = (newShape: Shape | null = modifiedShape) => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let copyShapes = [...shapes]
    if(newShape) {
      // replace activeShape with newShape
      copyShapes[copyShapes.indexOf(activeShape!)] = newShape
    }
    ctx.clearRect(0, 0, 800, 600) 
    for(let shape of copyShapes) {
      let pointsLen = shape.points.length
      for(let i = 0, j = pointsLen - 1; i < pointsLen; j = i++) {
        ctx.beginPath()
        ctx.moveTo(shape.points[i].x, shape.points[i].y)
        ctx.lineTo(shape.points[j].x, shape.points[j].y)
        ctx.stroke()        
      }
    }
  }

  const stopDrawing = (e: MouseEvent) => {
    let copyShapes = [...shapes]
    copyShapes[copyShapes.indexOf(activeShape!)] = modifiedShape!
    setShapes(copyShapes)
    setModifiedShape(null)
    setIsMoving(false)
    setDraggingX(0)
    setDraggingY(0)
    setActiveShape(null)
    // draw(e)
  }

  const calculateVector = (e: MouseEvent) => {
    console.log(draggingX, draggingY)
    const canvas: HTMLCanvasElement = canvasRef.current!
    const newX = e!.clientX - canvas.offsetLeft
    const newY = e!.clientY - canvas.offsetTop
    setVectorX(newX - draggingX)
    setVectorY(newY - draggingY) 
    // setDraggingX(newX)
    // setDraggingY(newY)
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")
    ctx!.canvas.width = 800
    ctx!.canvas.height = 600
  }, [])

  useEffect(() => {
    draw()
  }, [shapes, modifiedShape])

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    if(!isMoving) { return }
    console.log(vectorX, vectorY)
    let newPoints: Point[] = activeShape?.points.map(point => { return {x: point.x + vectorX, y: point.y + vectorY} as Point })!
    let newShape = new Shape(newPoints)
    setModifiedShape(newShape)
    draw(newShape)
  }, [vectorX, vectorY])

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const onMouseMove = (e: MouseEvent) => calculateVector(e)
    canvas.addEventListener('mousemove', onMouseMove)
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [draggingX, draggingY])

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const onMouseDown = (e: MouseEvent) => getBoundingShape(e)
    const onMouseMove = (e: MouseEvent) => draw()
    const onMouseUp = (e: MouseEvent) => stopDrawing(e)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    // canvas.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
    // canvas.removeEventListener('mousemove', onMouseMove)
  }
    // const onMouseUp = (e: MouseEvent) => endDrawing()
  }, [shapes, points, activeShape, isMoving, draggingX, draggingY, modifiedShape]);

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
      {JSON.stringify(points)}
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default Transform2D