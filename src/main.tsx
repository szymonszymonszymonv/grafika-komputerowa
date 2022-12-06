import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, Route, createBrowserRouter } from "react-router-dom";
import App from "./pages/App";
import "styles/index.css";
import Gk1 from "./pages/Gk-1";
import Gk2 from "./pages/Gk-2";
import Gk3 from "./pages/Gk-3";
import ColorPicker from "./components/ColorPicker";
import Cube from "./components/Cube";
import Cone from "./components/Cone";
import Gk4 from "./pages/Gk-4";
import Quality from "./components/Quality";
import PointOperations from "./components/PointOperations";
import Gk5 from "./pages/Gk-5";
import Histogram from "./components/Histogram";
import Binarization from "./components/Binarization";
import Gk7 from "./pages/Gk-7";
import Gk6 from "./pages/Gk-6";
import Gk8 from "./pages/Gk-8";
import Gk9 from "./pages/Gk-9";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/gk-1",
                element: <Gk1 />,
            },
            {
                path: "/gk-2",
                element: <Gk2 />,
            },
            {
                path: "/gk-3",
                element: <Gk3 />,
                children: [
                    {
                        path: "color-picker",
                        element: <ColorPicker />,
                    },
                    {
                        path: "cube",
                        element: <Cube />,
                    },
                    {
                        path: "cone",
                        element: <Cone />,
                    },
                ],
            },
            {
                path: "/gk-4",
                element: <Gk4 />,
                children: [
                    {
                        path: "przeksztalcenia-punktowe",
                        element: <PointOperations></PointOperations>,
                    },
                    {
                        path: "polepszanie-jakosci",
                        element: <Quality></Quality>,
                    },
                ],
            },
            {
                path: "/gk-5",
                element: <Gk5 />,
                children: [
                    {
                        path: "histogram",
                        element: <Histogram />,
                    },
                    {
                        path: "binaryzacja",
                        element: <Binarization></Binarization>,
                    },
                ],
            },
            {
                path: "gk-6",
                element: <Gk6 />,
            },
            {
                path: "gk-7",
                element: <Gk7 />,
            },
            {
                path: "gk-8",
                element: <Gk8 />
            },
            {
                path: "gk-9",
                element: <Gk9 />
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
