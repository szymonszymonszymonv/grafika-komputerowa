import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

type Props = {};

function Binarization({}: Props) {
    const canvasRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [url, setUrl] = useState<string>("");
    const [threshold, setThreshold] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(1);

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

            const imageData = ctx!.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const data = imageData.data;

            // manualBinarization(data);

            // percentBlackSelection(data);
            console.log(data);

            ctx!.putImageData(imageData, 0, 0);
        });
    }, [url]);

    // const manualBinarization = (data: any) => {
    //     for (let i = 0; i < data.length; i += 4) {
    //         const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    //         const color = avg > threshold ? 0 : 255;
    //         data[i] = color; // red
    //         data[i + 1] = color; // green
    //         data[i + 2] = color; // blue
    //     }
    // };

    const manualBinarization = (event: any) => {
        const img = new Image();
        setThreshold(event);
        img.src = url;
        img.addEventListener("load", () => {
            const canvas: HTMLCanvasElement = canvasRef.current!;
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            const imageData = ctx!.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const avg = Math.round(
                    (data[i] + data[i + 1] + data[i + 2]) / 3
                );
                const color = avg > threshold ? 0 : 255;
                data[i] = color; // red
                data[i + 1] = color; // green
                data[i + 2] = color; // blue
            }

            ctx!.putImageData(imageData, 0, 0);
        });
    };

    // const percentBlackSelection = (data: any) => {
    //     let LUT = [];
    //     let limes = Math.round((percentage / 100) * (data.length / 4));
    //     let nextSum = 0;
    //     let pixelTable = Array(256);

    //     for (let i = 0; i < data.length; i += 4) {
    //         const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    //         pixelTable[avg] = (pixelTable[avg] ?? 0) + 1;
    //     }

    //     for (let i = 0; i < 256; ++i) {
    //         if (pixelTable[i] === undefined) {
    //             pixelTable[i] = 0;
    //         }
    //         nextSum = nextSum + pixelTable[i];

    //         if (nextSum < limes) {
    //             LUT[i] = 0;
    //         } else {
    //             LUT[i] = 255;
    //         }
    //     }

    //     for (let i = 0; i < data.length; i += 4) {
    //         const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);

    //         data[i] = LUT[avg]; // red
    //         data[i + 1] = LUT[avg]; // green
    //         data[i + 2] = LUT[avg]; // blue
    //     }
    // };

    const percentBlackSelection = (event: any) => {
        const img = new Image();
        setPercentage(event);
        img.src = url;
        img.addEventListener("load", () => {
            const canvas: HTMLCanvasElement = canvasRef.current!;
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            const imageData = ctx!.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const data = imageData.data;

            let LUT = [];
            let limes = Math.round((percentage / 100) * (data.length / 4));
            let nextSum = 0;
            let pixelTable = Array(256);

            for (let i = 0; i < data.length; i += 4) {
                const avg = Math.round(
                    (data[i] + data[i + 1] + data[i + 2]) / 3
                );
                pixelTable[avg] = (pixelTable[avg] ?? 0) + 1;
            }

            for (let i = 0; i < 256; ++i) {
                if (pixelTable[i] === undefined) {
                    pixelTable[i] = 0;
                }
                nextSum = nextSum + pixelTable[i];

                if (nextSum < limes) {
                    LUT[i] = 0;
                } else {
                    LUT[i] = 255;
                }
            }

            for (let i = 0; i < data.length; i += 4) {
                const avg = Math.round(
                    (data[i] + data[i + 1] + data[i + 2]) / 3
                );

                data[i] = LUT[avg]; // red
                data[i + 1] = LUT[avg]; // green
                data[i + 2] = LUT[avg]; // blue
            }
            ctx!.putImageData(imageData, 0, 0);
        });
    };

    return (
        <>
            <div>
                <input
                    type="number"
                    min="0"
                    max="255"
                    placeholder="podaj wartosc progu"
                    onChange={(e) =>
                        manualBinarization(parseInt(e.target.value))
                    }
                />
            </div>
            <div>
                <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="podaj wartosc procentowa koloru czarnego"
                    onChange={(e) =>
                        percentBlackSelection(parseInt(e.target.value))
                    }
                />
                <span>%</span>
            </div>
            <div>
                <input
                    id="file"
                    type="file"
                    onChange={(e) => onUploadFile(e)}
                ></input>
            </div>
            <div>
                <canvas ref={canvasRef}></canvas>
            </div>
        </>
    );
}

export default Binarization;
