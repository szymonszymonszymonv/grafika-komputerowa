import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'

type Props = {}

function Morphological({}: Props) {
    const canvasRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [pixelsData, setPixelsData] = useState<number[][]>([]);
    const [pixelsGrayscale, setPixelsGrayscale] = useState<number[][]>([]);
    const [pixelsDataMatrix, setPixelsDataMatrix] = useState<number[][][][]>(
        []
    );
    const [url, setUrl] = useState<string>("");

    const onUploadFile = (e: BaseSyntheticEvent) => {
        const file = e.target.files[0];
        setUploadedImage(file);
        console.log(file);
        setUrl(URL.createObjectURL(file));
    };

    // init canvas
    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        ctx!.canvas.width = 800;
        ctx!.canvas.height = 600;
    }, []);

    // draw img on canvas
    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.addEventListener("load", () => {
            const canvas: HTMLCanvasElement = canvasRef.current!;
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            const bounding = canvas.getBoundingClientRect();
            const imageData: ImageData = ctx?.getImageData(
                0,
                0,
                bounding.width,
                bounding.height
            )!;

            const pixelsData = imageData.data.reduce(
                (row: any, val: any, idx) => {
                    return (
                        (idx % 4 === 0
                            ? row.push([val])
                            : row[row.length - 1].push(val)) && row
                    );
                },
                [] as number[][]
            );
            setPixelsData(pixelsData);



        });
    }, [url]);

    const isNeighborPixelBlackOrWhite = (x: number, y: number, ctx: any, color: string) => {
        for (let i = x - 1; i <= x + 1; i++) {
            // console.log("x=" + x)
            // console.log("i=" + i)
            for (let j = y - 1; j <= y + 1; j++) {
                // console.log("y=" + y)
                // console.log("j=" + j)
                let data = ctx.getImageData(i, j, 1, 1).data;
                // console.log("data " + data)
                if(color === "black"){
                    if (data[0] === 0 && data[1] === 0 && data[2] === 0) {
                        return true;
                    }
                }
                if(color === "white"){
                    if (data[0] === 255 && data[1] === 255 && data[2] === 255) {
                        return true;
                    }
                }

            }
        }
        return false;
    };

    const dilation = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

        let isNeighborBlackTable: boolean[][] = [];

        for (let i = 0; i < bounding.width; i++) {
            isNeighborBlackTable[i] = [];
            for (let j = 0; j < bounding.height; j++) {
                // console.log(isNeighborPixelBlack(i, j, ctx))
                isNeighborBlackTable[i][j] = isNeighborPixelBlackOrWhite(i, j, ctx, "black");
            }
        }

        for (let i = 0; i < bounding.width; i++) {
            for (let j = 0; j < bounding.height; j++) {
                let imageData = ctx?.getImageData(i, j, 1, 1);
                if (isNeighborBlackTable[i][j]) { // jezeli tak to czarny
                    imageData!.data[0] = 0;
                    imageData!.data[1] = 0;
                    imageData!.data[2] = 0;
                } else {  // jak nie to biały
                    imageData!.data[0] = 255;
                    imageData!.data[1] = 255;
                    imageData!.data[2] = 255;
                }
                ctx!.putImageData(imageData!, i, j);
            }
        }
    };

    const erosion = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

        let isNeighborWhiteTable: boolean[][] = [];

        for (let i = 0; i < bounding.width; i++) {
            isNeighborWhiteTable[i] = [];
            for (let j = 0; j < bounding.height; j++) {
                // console.log(isNeighborPixelBlack(i, j, ctx))
                isNeighborWhiteTable[i][j] = isNeighborPixelBlackOrWhite(i, j, ctx, "white");
            }
        }

        for (let i = 0; i < bounding.width; i++) {
            for (let j = 0; j < bounding.height; j++) {
                let imageData = ctx?.getImageData(i, j, 1, 1);
                if (isNeighborWhiteTable[i][j]) { // jezeli tak to biały
                    imageData!.data[0] = 255;
                    imageData!.data[1] = 255;
                    imageData!.data[2] = 255;
                } else {  // jak nie to czarny
                    imageData!.data[0] = 0;
                    imageData!.data[1] = 0;
                    imageData!.data[2] = 0;
                }
                ctx!.putImageData(imageData!, i, j);
            }
        }

    };

    const opening = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

        erosion()
        dilation()


    };

    const closing = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

        dilation()
        erosion()

    };

    const thin = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        

    };

    const thicken = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const bounding = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");

    };
    return (
        <>
            <div>
                <input
                    id="file"
                    type="file"
                    onChange={(e) => onUploadFile(e)}
                ></input>
            </div>
            <div>
                <button
                    onClick={() => {
                        dilation();
                    }}
                >
                    dilation
                </button>
                <button
                    onClick={() => {
                        erosion();
                    }}
                >
                    erosion
                </button>
                <button onClick={() => {opening()}}>opening</button>
                <button onClick={() => {closing()}}>closing</button>
                <button onClick={() => {thin()}}>thin</button>
                <button onClick={() => {thicken()}}>thicken</button>
            </div>
            <div>
                <canvas ref={canvasRef}></canvas>
            </div>
        </>
    );
}

export default Morphological;
