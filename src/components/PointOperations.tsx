import { faSubscript } from "@fortawesome/free-solid-svg-icons";
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

type Props = {};

function PointOperations({}: Props) {
    const canvasRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [url, setUrl] = useState<string>("");
    // const [additionValue, setAdditionValue] = useState<number>(0);
    const [additionValueRed, setAdditionValueRed] = useState<number>(0);
    const [additionValueGreen, setAdditionValueGreen] = useState<number>(0);
    const [additionValueBlue, setAdditionValueBlue] = useState<number>(0);

    const [subtractionValueRed, setSubtractionValueRed] = useState<number>(0);
    const [subtractionValueGreen, setSubtractionValueGreen] =
        useState<number>(0);
    const [subtractionValueBlue, setSubtractionValueBlue] = useState<number>(0);

    const [multiplicationValueRed, setMultiplicationValueRed] =
        useState<number>(1);
    const [multiplicationValueGreen, setMultiplicationValueGreen] =
        useState<number>(1);
    const [multiplicationValueBlue, setMultiplicationValueBlue] =
        useState<number>(1);

    const [divisionValueRed, setDivisionValueRed] = useState<number>(1);
    const [divisionValueGreen, setDivisionValueGreen] = useState<number>(1);
    const [divisionValueBlue, setDivisionValueBlue] = useState<number>(1);

    const [darkenValue, setDarkenValue] = useState<number>(NaN);
    const [brightenValue, setBrightenValue] = useState<number>(NaN);

    const [grey1Clicked, setGrey1Clicked] = useState<boolean>(false);
    const [grey2Clicked, setGrey2Clicked] = useState<boolean>(false);

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

            addition(data);
            subtraction(data);
            multiplication(data);
            division(data);
            // if (!isNaN(darkenValue)) {
            //     darken(data);
            // }

            if (!isNaN(brightenValue)) {
                brighten(data);
            }

            if (grey1Clicked) {
                greyOne(data);
            }
            if (grey2Clicked) {
                greyAvg(data);
            }

            console.log(data);

            ctx!.putImageData(imageData, 0, 0);
        });
    }, [
        url,
        additionValueRed,
        additionValueGreen,
        additionValueBlue,
        subtractionValueRed,
        subtractionValueGreen,
        subtractionValueBlue,
        multiplicationValueRed,
        multiplicationValueGreen,
        multiplicationValueBlue,
        divisionValueRed,
        divisionValueGreen,
        divisionValueBlue,
        darkenValue,
        brightenValue,
        grey1Clicked,
        grey2Clicked,
    ]);

    const addition = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            data[i] += additionValueRed % 256; // red
            data[i + 1] += additionValueGreen % 256; // green
            data[i + 2] += additionValueBlue % 256; // blue
        }
    };

    const subtraction = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            if (subtractionValueRed <= data[i]) {
                data[i] -= subtractionValueRed;
            } else {
                data[i] = 0;
            }
            if (subtractionValueGreen <= data[i]) {
                data[i + 1] -= subtractionValueGreen;
            } else {
                data[i + 1] = 0;
            }
            if (subtractionValueBlue <= data[i]) {
                data[i + 2] -= subtractionValueBlue;
            } else {
                data[i + 2] = 0;
            }
        }
    };

    const multiplication = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            data[i] *= multiplicationValueRed % 256;

            data[i + 1] *= multiplicationValueGreen % 256;

            data[i + 2] *= multiplicationValueBlue % 256;
        }
    };

    const division = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            if (divisionValueRed > 0) {
                data[i] /= divisionValueRed % 256;
            }

            if (divisionValueGreen > 0) {
                data[i + 1] /= divisionValueGreen % 256;
            }

            if (divisionValueBlue > 0) {
                data[i + 2] /= divisionValueBlue % 256;
            }
        }
    };

    const darken = (data: any) => {
        let table: any = [];

        for (let i = 0; i < data.length; i += 4) {
            let r = darkenValue * Math.pow(data[i], 2);
            let g = darkenValue * Math.pow(data[i + 1], 2);
            let b = darkenValue * Math.pow(data[i + 2], 2);

            table[i] = r;
            table[i + 1] = g;
            table[i + 2] = b;
            table[i + 3] = 255;
        }
        const max = table.reduce((a: any, b: any) => Math.max(a, b), -Infinity);

        console.log(max);
        console.log(table);

        for (let i = 0; i < data.length; i += 4) {
            table[i] = (table[i] * 255) / max;
            table[i + 1] = (table[i + 1] * 255) / max;
            table[i + 2] = (table[i + 2] * 255) / max;
        }

        console.log(table);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = table[i];
            data[i + 1] = table[i + 1];
            data[i + 2] = table[i + 2];
        }
    };

    const brighten = (data: any) => {
        let table: any = [];
        for (let i = 0; i < data.length; i += 4) {
            table[i] = Math.log(data[i] + 1) * brightenValue;
            table[i + 1] = Math.log(data[i + 1] + 1) * brightenValue;
            table[i + 2] = Math.log(data[i + 2] + 1) * brightenValue;
            table[i + 3] = 255;

            // data[i] = Math.log(data[i] + 1) * brightenValue;
            // data[i + 1] = Math.log(data[i + 1] + 1) * brightenValue;
            // data[i + 2] = Math.log(data[i + 2] + 1) * brightenValue;
        }
        const max = table.reduce((a: any, b: any) => Math.max(a, b), -Infinity);
        console.log(max);

        console.log(table);
        for (let i = 0; i < data.length; i += 4) {
            table[i] = (table[i] * 255) / max;
            table[i + 1] = (table[i + 1] * 255) / max;
            table[i + 2] = (table[i + 2] * 255) / max;
        }

        console.log(table);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = table[i];
            data[i + 1] = table[i + 1];
            data[i + 2] = table[i + 2];
        }
    };

    const greyAvg = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
    };

    const greyOne = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i];
            data[i + 1] = data[i];
            data[i + 2] = data[i];
        }
    };

    return (
        <>
            <div>
                <input
                    type="number"
                    min="0"
                    placeholder="dodaj wartosc czerwieni"
                    onChange={(e) =>
                        setAdditionValueRed(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="dodaj wartosc zielonego"
                    onChange={(e) =>
                        setAdditionValueGreen(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="dodaj wartosc niebieskiego"
                    onChange={(e) =>
                        setAdditionValueBlue(parseInt(e.target.value))
                    }
                />
            </div>
            <div>
                <input
                    type="number"
                    min="0"
                    placeholder="odejmij wartosc czerwieni"
                    onChange={(e) =>
                        setSubtractionValueRed(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="odejmij wartosc zielonego"
                    onChange={(e) =>
                        setSubtractionValueGreen(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="odejmij wartosc niebieskiego"
                    onChange={(e) =>
                        setSubtractionValueBlue(parseInt(e.target.value))
                    }
                />
            </div>

            <div>
                <input
                    type="number"
                    min="0"
                    placeholder="pomnoz wartosc czerwieni"
                    onChange={(e) =>
                        setMultiplicationValueRed(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="pomnoz wartosc zielonego"
                    onChange={(e) =>
                        setMultiplicationValueGreen(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="pomnoz wartosc niebieskiego"
                    onChange={(e) =>
                        setMultiplicationValueBlue(parseInt(e.target.value))
                    }
                />
            </div>

            <div>
                <input
                    type="number"
                    min="0"
                    placeholder="podziel wartosc czerwieni"
                    onChange={(e) =>
                        setDivisionValueRed(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="podziel wartosc zielonego"
                    onChange={(e) =>
                        setDivisionValueGreen(parseInt(e.target.value))
                    }
                />
                <input
                    type="number"
                    min="0"
                    placeholder="podziel wartosc niebieskiego"
                    onChange={(e) =>
                        setDivisionValueBlue(parseInt(e.target.value))
                    }
                />
            </div>

            {/* <div>
                <input
                    type="number"
                    min="0"
                    placeholder="wartosc przyciemnienia"
                    onChange={(e) => setDarkenValue(parseInt(e.target.value))}
                />
            </div> */}

            <div>
                <input
                    type="number"
                    min="0"
                    placeholder="wartosc rozjasnienia"
                    onChange={(e) => setBrightenValue(parseInt(e.target.value))}
                />
            </div>
            <div>
                <button onClick={() => setGrey1Clicked(true)}>szary1</button>
            </div>
            <div>
                <button onClick={() => setGrey1Clicked(true)}>szary2</button>
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

export default PointOperations;
