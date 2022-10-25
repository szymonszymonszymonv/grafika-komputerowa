import React from "react";
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
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
