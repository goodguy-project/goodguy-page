import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Index from "./page";
import UserList from "./page/userlist";
import Profile from "./page/profile";
import OfficialList from "./page/official_list";

export default function Router(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/user-list" element={<UserList/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/official-list" element={<OfficialList/>}/>
            </Routes>
        </BrowserRouter>
    );
}