import styles from "./layout.module.css";
import cn from "classnames";

export default function Layout({ children }) {
    return (
        <div className={cn({
            [styles.container]: true,
        })}>{children}</div>
    )
}