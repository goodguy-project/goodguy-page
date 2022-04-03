import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import IndexPage from "./page/index";
import RegisterPage from "./page/register/register";
import LoginPage from "./page/login/login";
import Logout from "./page/logout/logout";
import UpdatePage from "./page/update/update";
import UserListPage from "./page/userlist/userlist";
import ProfilePage from "./page/profile/profile";
import AdminPage from "./page/admin/admin";

function SetElement(title: string, element: () => JSX.Element): () => JSX.Element {
    return function() {
        document.title = title;
        return element();
    };
}

export default function Router(): JSX.Element {
    const Index = SetElement("首页", IndexPage);
    const Register = SetElement("注册", RegisterPage);
    const Login = SetElement("登录", LoginPage);
    const Update = SetElement("更新", UpdatePage);
    const UserList = SetElement("用户列表", UserListPage);
    const Admin = SetElement("管理页面", AdminPage);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/update" element={<Update/>}/>
                <Route path="/userlist" element={<UserList/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/admin" element={<Admin/>}/>
            </Routes>
        </BrowserRouter>
    );
}