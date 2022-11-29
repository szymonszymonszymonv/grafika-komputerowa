import { useState } from "react";
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    Link,
    Outlet,
} from "react-router-dom";
import electron from "/electron.png";
import react from "/react.svg";
import vite from "/vite.svg";
import styles from "styles/app.module.scss";

const App: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div className={styles.app}>
            <ul>
                <li>
                    <Link to={"gk-1"}>gk-1</Link>
                </li>
                <li>
                    <Link to={"gk-2"}>gk-2</Link>
                </li>
                <li>
                    <Link to={"gk-3"}>gk-3</Link>
                </li>
                <li>
                    <Link to={"gk-4"}>gk-4</Link>
                </li>
                <li>
                    <Link to={"gk-5"}>gk-5</Link>
                </li>
                <li>
                    <Link to={"gk-6"}>gk-6</Link>
                </li>
                <li>
                    <Link to={"gk-7"}>gk-7</Link>
                </li>
            </ul>
            <Outlet></Outlet>
        </div>
    );
};

export default App;
