import MainPage from "./Main/Main"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./login/login";
import SignUpPage from "./signUp/signUp";
import SnsSignUpPage from "./signUp/snsSignUp";
import WritePage from "./write/write";
import ProductViewDetailsPage from "./productViewDetails/productViewDetails";
import ChatPage from "./chat/chat";
import CategorySearchPage from "./categorySearch/categorySearch";

function Routers() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path = "/*" element={<MainPage />} />
                    <Route path = "/login" element={<LoginPage />} />
                    <Route path = "/snsSignUp" element={<SnsSignUpPage />} />
                    <Route path = "/signUp" element={<SignUpPage />} />
                    <Route path = "/write" element={<WritePage />} />
                    <Route path = "/productViewDetails" element={<ProductViewDetailsPage />} />
                    <Route path = "/chat" element={<ChatPage />} />
                    <Route path = "/categorySearch" element={<CategorySearchPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Routers;