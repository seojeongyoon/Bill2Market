import React, {useEffect, useState} from "react";
import HeaderPage from "../header/header";
import "./myPage.css";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import MyLendListPage from "./myLendList";
import MyBorrowListPage from "./myBorrowList";
import MyBasketListPage from "./myBasketList";
import MyItemReview from "./myItemReview";

function MyPage () {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [trustPoint, setTrustPoint] = useState(0);
    const [ready, setReady] = useState(0);

    const tabHandler = (index) => {
        setTabIndex(index);
    }
    const nickNameHandler = () => {
        if(ready === 0) {
            setReady(1)
        } else {
            setReady(0)
            dispatch({type: "NICKNAME", payload: userNick})
        }

    }

    const getClientInfo = () => {
        axios.get("clients/me", {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }
        }).then(response => {
            sessionStorage.setItem('client_index', response.data.data.clientIndex)
            setEmail(response.data.data.email)
            setTrustPoint(response.data.data.trustPoint)
            console.log(response.data.data.trustPoint)
        })
            .catch(error => {
                console.log(error.response.data);
            })
    }

    const onSubmit = () => {
        const clientIndex = sessionStorage.getItem('client_index');
        console.log(clientIndex)
        const option = {
            url : "/clients/"+clientIndex+"/nickname",
            method: 'PUT',
            header: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            },
            data: 'nickname=' + userNick
        }

        axios(option)
            .then(res=>{
                if (res.status >= 200 && res.status <= 204) {
                    console.log(res.data.message);
                }
            }).catch(res=>{
            alert(res.response.data.message);
        });
    };

    const nickName = useSelector(state => state.nickName);
    const [userNick, setUserNick] = useState(nickName);

    const nickNameChange = (e) => {
        console.log(userNick)
        setUserNick(e.target.value)
    }

    const TapContent = [
        {
            myTitle:(
                <li className="tabTitle1" onClick={()=>tabHandler(0)}>?????? ?????? ??????</li>
            ),
            myContent:(
                <div>
                <MyLendListPage/>
                </div>
            )
        },
        {
            myTitle:(
                <li className="tabTitle" onClick={()=>tabHandler(1)}>?????? ?????? ??????</li>
            ),
            myContent:(
                <div><MyBorrowListPage/></div>
            )
        },
        {
            myTitle:(
                <li className="tabTitle" onClick={()=>tabHandler(2)}>??? ??????</li>
            ),
            myContent:(
                <div><MyBasketListPage/></div>
            )
        },
        {
            myTitle:(
                <li className="tabTitle" onClick={()=>tabHandler(3)}>??????</li>
            ),
            myContent:(
                <div><MyItemReview/></div>
            )
        }
    ]


    useEffect(() => {
        getClientInfo()
        },[])

    return(
        <div>
            <title></title>
            <header>
                <HeaderPage></HeaderPage>
            </header>

            <div className = "myPageWrap">
                <div className = "user">
                    <div className= "userPhoto">
                    </div>
                    <div className="userContent">
                    {ready === 0 ?
                    <div>
                        {nickName}
                    <button className="nickNameChangeBtn" onClick= {nickNameHandler}>????????? ??????</button>

                    </div>

                        :
                    <div>
                        <input type="text" maxLength="40" onChange={nickNameChange} value={userNick} />
                    <button className="nickNameChangeBtn" onClick={() => {
                        nickNameHandler()
                        onSubmit()}}>??????</button>
                    </div>
                        }
                        {email}
                        {trustPoint == null ?
                            <div>????????? ?????? : ?????? ????????? ????????????</div>
                            :
                            <div>????????? ?????? : {trustPoint}</div>
                        }

                    </div>
                </div>

                <div>
                    <ul className = "tab">
                        {TapContent.map((section)=>{
                            return section.myTitle
                            })}
                    </ul>

                    <div className = "tabCont">
                        <div className = "tabContDetail">
                        {TapContent[tabIndex].myContent}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default MyPage;