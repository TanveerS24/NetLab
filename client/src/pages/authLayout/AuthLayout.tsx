import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <>
            <div className="grid grid-cols-2 min-h-screen">
                <div className="grid grid-rows-[auto_1fr]">
                    <div className="bg-transparent text-slate-900">
                        <div >NetLab</div>
                        <div>Visually Learn stuff</div>
                    </div>
                    <div className="bg-white text-slate-900">
                        <div>Welcome</div>
                    </div>
                </div>
                <div className="bg-blue-100 text-blue-900">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default AuthLayout;