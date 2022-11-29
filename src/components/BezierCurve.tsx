import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

type Props = {};
interface Point {
    x: number;
    y: number;
}
function BezierCurve({}: Props) {
    const canvasRef = useRef(null);
    const contexRef = useRef<any>(null);

    // const [p0X, setP0X] = useState<number>(0);
    // const [p1X, setP1X] = useState<number>(0);
    // const [p2X, setP2X] = useState<number>(0);
    // const [p3X, setP3X] = useState<number>(0);
    // const [p0Y, setP0Y] = useState<number>(0);
    // const [p1Y, setP1Y] = useState<number>(0);
    // const [p2Y, setP2Y] = useState<number>(0);
    // const [p3Y, setP3Y] = useState<number>(0);
    const [pX, setPX] = useState<number>(0);
    const [pY, setPY] = useState<number>(0);
    const [pointsTable, setPointsTable] = useState<Point[]>([]);

    const canvasOffsetX = useRef<any>(null);
    const canvasOffsetY = useRef<any>(null);
    const startX = useRef<any>(null);
    const startY = useRef<any>(null);
    const [prevX, setPrevX] = useState<any>(null);
    const [prevY, setPrevY] = useState<any>(null);
    const [prevPoint, setPrevPoint] = useState<any>(null);

    const [isMoving, setIsMoving] = useState<boolean>(false);

    // init canvas
    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        ctx!.canvas.width = 800;
        ctx!.canvas.height = 600;
    }, []);

    // draw img on canvas
    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        contexRef.current = ctx;
        canvas.width = 800;
        canvas.height = 600;

        const canvasOffSet = canvas.getBoundingClientRect();
        canvasOffsetX.current = Math.round(canvasOffSet.left);
        canvasOffsetY.current = Math.round(canvasOffSet.top);

        bezier(ctx);

        console.log(pointsTable);
    }, [pointsTable]);

    const startMovingPoint = ({ nativeEvent }: any) => {
        // nativeEvent.preventDefault()
        // nativeEvent.stopPropagation()
        startX.current = nativeEvent.clientX - canvasOffsetX.current;
        startY.current = nativeEvent.clientY - canvasOffsetY.current;
        let currentPoint = { x: startX.current, y: startX.current };
        // console.log(pointsTable.find((element) => element === currentPoint)); not working
        let pointFounded = pointsTable.find(
            // find if we click on red point
            (element) =>
                element.x <= startX.current &&
                element.x + 6 >= startX.current && // 6 is point size
                element.y <= startY.current &&
                element.y + 6 >= startY.current
        );

        if (pointFounded) {
            console.log("clicked red rect");

            setPrevPoint(pointFounded);
            setIsMoving(true);
        }
    };

    const movePoint = ({ nativeEvent }: any) => {
        if (!isMoving) {
            return;
        }
        console.log("prev");
        console.log(prevX);
        console.log(prevY);

        let newMouseX;
        let newMouseY;

        newMouseX = nativeEvent.clientX - canvasOffsetX.current;
        newMouseY = nativeEvent.clientY - canvasOffsetY.current;

        console.log(newMouseX);
        console.log(newMouseY);

        let newPoint = { x: prevX, y: prevY };
        console.log("new point = " + JSON.stringify(newPoint));

        // let index = pointsTable.indexOf(closest);
        let index = pointsTable.indexOf(prevPoint);
        console.log("index = " + index);
        let newPointTable = [...pointsTable]; //copy old data
        newPointTable[index] = newPoint;
        setPointsTable(newPointTable);

        setPrevX(newMouseX);
        setPrevY(newMouseY);
        setPrevPoint(newPoint);
    };

    const finishMovingPoint = () => {
        setIsMoving(false);
    };

    const addPoint = () => {
        setPointsTable((prev) => [...prev, { x: pX, y: pY }]);
        // pointsTable.push({ x: pX, y: pY });
    };

    const factorial: any = (n: number) => {
        if (n < 0) return -1;
        if (n == 0) return 1;
        else {
            return n * factorial(n - 1);
        }
    };

    const countNewton = (n: number, r: number) => {
        return factorial(n) / (factorial(r) * factorial(n - r));
    };

    const bezier = (ctx: any) => {
        if (pointsTable.length === 0) {
            return;
        }
        ctx?.moveTo(pointsTable[0].x, pointsTable[0].y);
        let n = pointsTable.length;

        let curvepoints = [];
        for (let u = 0; u <= 1; u += 0.0001) {
            let p = { x: 0, y: 0 };

            for (let i = 0; i < n; i++) {
                let newton = countNewton(n - 1, i);
                let ti = Math.pow(u, i);
                let lti = Math.pow(1 - u, n - 1 - i);

                // let B = countNewton(n - 1, i) * Math.pow(1 - u, n - 1 - i) * Math.pow(u, i);
                let xPoint = newton * ti * lti * pointsTable[i].x;
                let yPoint = newton * ti * lti * pointsTable[i].y;

                p.x += xPoint;
                p.y += yPoint;
            }

            curvepoints.push(p);
            ctx!.lineTo(p.x, p.y);
        }
        ctx?.stroke();

        for (let i = 0; i < n; i++) {
            ctx!.fillStyle = "Red";
            ctx?.fillRect(pointsTable[i].x, pointsTable[i].y, 6, 6);
        }

        return curvepoints;
    };

    return (
        <>
            <div>
                <input
                    type="number"
                    min="0"
                    max="255"
                    placeholder="x"
                    onChange={(e) => setPX(parseInt(e.target.value))}
                />
                <input
                    type="number"
                    min="0"
                    max="255"
                    placeholder="y"
                    onChange={(e) => setPY(parseInt(e.target.value))}
                />
                <button onClick={addPoint}>klik</button>
            </div>

            <div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startMovingPoint}
                    onMouseUp={finishMovingPoint}
                    onMouseMove={movePoint}
                />
            </div>
        </>
    );
}

export default BezierCurve;
