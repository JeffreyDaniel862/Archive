import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export default function Dashboard() {
    const { user } = useSelector(state => state.user);
    if (!user) {
        return <Navigate to={'/sign-in'} />
    }

    return (
        <h1>Dasboard</h1>
    )
}