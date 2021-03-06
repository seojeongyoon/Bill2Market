import HeaderPage from "../header/header";
import React, {useEffect, useRef, useState} from "react";
import {Badge, Divider, Card, Avatar, Layout, BackTop, Input, Button, Image} from 'antd';
import "./chat.css";

import {useLocation, useNavigate} from "react-router-dom"
import Meta from "antd/es/card/Meta";
import {SendOutlined} from "@ant-design/icons";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";






function ChatPage () {
    const itemOption = {
        itemPic: "" ,
        itemTitle: "",
        itemPrice: "",
        itemDeposit: ""
    }

    const [chatList, setChatList] = useState([]);
    const [key,setKey] = useState([]);

    const [itemId,setItemId ] = useState(useLocation().state) ;
    const [items, setItems]= useState(itemOption);

    const [sockChatId, setSockChatId] = useState("");

    const [chattingTime, setChattingTime] = useState(new Map());

    const [messageLast, setMessageLast] = useState(new Map());

    const [allMessage, setAllMessage] = useState([]);





    // let sock = new SockJS('http://localhost:8080/bill2-ws')
    // let client = Stomp.over(sock);



    const AWS = require("aws-sdk");


    const s3 = new AWS.S3 ({
        accessKeyId: "AKIA5JDRDAAYWXFYKPXK",
        secretAccessKey: "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",
    });



    const keyFunc = (url,index) => {
        let keyArray = url.split("/");
        let key = keyArray[3] + "/" + keyArray[4];
        const params = {
            Bucket: "bill2market",
            Key: key.toString()
        }
        s3.getObject(params, (err, data) => {
            if (err) {
                throw err;
            }

            let messageLast = data.Body.toString('utf-8');
            let messageLast2 = messageLast.split("\n");
            let messageLength = messageLast2.length-2;
            let messageLast3 = messageLast2[messageLength];
            let messageLast4 = messageLast3.split(" ")[2];
            let chatMessageSplitContent = messageLast3.split(" ")[4];
            let chatTime = messageLast3.split(" ")[1];
            let chatTime2 = chatTime.split(":")[0] + ":" + chatTime.split(":")[1];


            const chatMessageType = () => {
                if (messageLast4 === "0") {
                    return chatMessageSplitContent;

                }
                else if (messageLast4  === "1") {
                    return ("????????? ????????? ???????????????.");


                }
                else if (messageLast4  === "2") {
                    return ("????????? ?????????????????????.");


                }
                else if (messageLast4  === "3") {
                    return ("????????? ?????????????????????.");


                }
                else if (messageLast4  === "4") {
                    return ("???????????? ????????? ??????????????????.");



                }
                else if (messageLast4  === "5") {
                    return ("??????????????? ?????????????????????.");


                }
                else {
                    return ("????????? ?????????????????????.");


                }
            }
            setMessageLast((prev)=>new Map(prev).set(index,chatMessageType(messageLast4)));
            setChattingTime((prev)=>new Map(prev).set(index,chatTime2));
        });



    }





    const chatInfo = () => {
        axios.get("/chats/client", {
            headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    response.data.data.map((chat,index)=>
                        keyFunc(chat.fileName,index)
                    );
                    setChatList(response.data.data);
                    // setSockChatId(chatList.chatId);
                }
            })
            .catch(res => {
                console.log("fail");
            })};




    const ChatItemProduct  = () => {
        // console.log(itemId);
        axios.get("/items/" + itemId , {headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }})

            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    setItems({...itemOption,
                        itemPic:  response.data.data.item.photos[0].itemPhoto,
                        itemTitle: response.data.data.item.itemTitle,
                        itemPrice: "????????? : " + response.data.data.item.price + "???",
                        itemDeposit: "????????? : " + response.data.data.item.deposit + "???"});


                }
            })
            .catch(res => {
                console.log("fail");
            })
    }

    function messageSet () {
        // console.log(messageLast);
        const list = chatList.map((chat,index)=>{
            const container = chat;
            container.message = messageLast.get(index);
            container.time = chattingTime.get(index);
            return container;
        })
        setChatList(list);


    }


    useEffect(() => {

        chatInfo ();



    }, []);

    useEffect(() => {

        messageSet();


    }, [messageLast,chattingTime]);






    const otherProduct = (itemId) => {
        // console.log(itemId);
        setItemId(itemId);
        // console.log(chatList);
    }



    const otherMessage = (url) => {
        let keyArray = url.split("/");
        let key = keyArray[3] + "/" + keyArray[4];
        const params = {
            Bucket: "bill2market",
            Key: key.toString()
        }
        s3.getObject(params, (err, data) => {
            if (err) {
                throw err;
            }

            let message = data.Body.toString('utf-8');
            let messageSplit = message.split("\n");
            let deleteLast = messageSplit.slice(0,-1);   //????????? ??? ?????? ??????
            let array = new Array();
            // let nickname = sessionStorage.getItem("nickName");
            let nickname = "kakaka";    //?????? ?????? ????????? ???????????? ???????????? ??? ???????????? ???????????? ?????? ??????????????? ?????? ??????????????????.
            let tempDate = "";
            deleteLast.map(string=> {
                let temp = new Object();
                let messageArray = string.split(" ");

                const MessageType = () => {
                    if (temp.type === "0") {
                        return temp.message;

                    }
                    else if (temp.type  === "1") {
                        return ("????????? ????????? ???????????????.");


                    }
                    else if (temp.type  === "2") {
                        return ("????????? ?????????????????????.");


                    }
                    else if (temp.type === "3") {
                        return ("????????? ?????????????????????.");


                    }
                    else if (temp.type === "4") {
                        return ("???????????? ????????? ??????????????????.");



                    }
                    else if (temp.type === "5") {
                        return ("??????????????? ?????????????????????.");


                    }
                    else if (temp.type === "6") {
                        return ("????????? ?????????????????????.");

                    }
                    else {
                        return ("????????? ????????? ??????????????????.");

                    }
                }          //????????? ????????? ?????? ????????? ?????? ??????




                temp.date = messageArray[0];
                temp.dateSplit = temp.date.split("-")[0] + "??? " + temp.date.split("-")[1] + "??? " + temp.date.split("-")[2] + "???"
                if (temp.dateSplit === tempDate) {
                    temp.dateSplit = null;
                }
                else {
                    tempDate = temp.dateSplit;
                }          //???????????? ?????? ?????? ??????

                temp.time = messageArray[1]
                temp.timeSplit = temp.time.split(":")[0] + ":" + temp.time.split(":")[1];
                temp.type = messageArray[2];
                temp.nickname = messageArray[3];
                temp.message = messageArray[4];
                temp.messageDivide = MessageType(temp.message);

                if (messageArray[3] === nickname) {
                    temp.sender = true;
                }
                else {
                    temp.sender = false;
                }

                array.push(temp);

            })

            setAllMessage(array);
            console.log(array);
        });
    }


    // 0 : ?????? ?????????
    //
    // 1 : ?????????????????? S3 ??????
    //
    // 2 : ???????????? ????????? (contract_id, start_date, end_date ??????)
    //
    // 3 : ???????????? ????????? (contract_id)
    //
    // 4 : ???????????? ?????? ?????? ?????? ????????? (contract_id)
    //
    // 5 : ???????????? ?????? ?????? ????????? (contract_id)
    //
    // 6 : ???????????? ????????? (contract_id)




    // useEffect(() => {
    //     client.connect({}, () =>{
    //         console.log("?????? ?????? ?????? ??????")
    //         client.subscribe("/sub/chat/"+chatList.chatId);
    //         client.send(` /pub/chat/message`);
    //
    //     })
    //    client.disconnect({}, () =>{
    //        console.log("?????? ?????? ?????? ?????? ??????")
    //    })
    //
    // }, [])
    //


    // Create Message

    // client.send(`/app/chat/userId}`,{},JSON.stringify(userId))
    //
    // client.subscribe('/queue/addChatToClient/'+auth.user.id, function(messageDTO){
    //     const messagedto = JSON.parse(messageDTO.body)
    // })
    //
    //




    return (
        <Layout className="chatPageMain">
            <header>
                <HeaderPage></HeaderPage>
            </header>

            <Divider></Divider>

            <Layout className="chatPage_container">
                {chatList.map(chat => {
                        return (
                            <Card className="chatCard"
                                  hoverable
                                  onClick={() => {otherProduct(chat.itemId)
                                      otherMessage(chat.fileName)
                                      ChatItemProduct(chat.itemId)}}>
                                <Meta
                                    avatar={<Badge size="small" count={111}><Avatar src=""/> </Badge>}
                                    title={chat.nickname}
                                    description= {chat.message}
                                />
                                <p className="date">{chat.time}</p>
                            </Card>
                        )
                    }
                )}




            </Layout>

            <Layout className="chatPageDetails_container">
                <Card className="chatProductCard">
                    <Image className="chatItemImage" src={ items["itemPic"]}/>
                    <p className="chatItemTitle">{ items["itemTitle"]}</p>
                    <p className="chatItemPrice">{items["itemPrice"]}</p>
                    <p className="chatItemDeposit">{items["itemDeposit"]}</p>
                </Card>
                {allMessage.map(message=> {
                    return (
                        <div className={message.sender ? "sendMessage" : "receiveMessage"}>
                            {message.dateSplit != null ?
                                <div className = "dateBox">{"<" + message.dateSplit  + ">"}</div>: null}
                            <div className = {message.sender ? "sendMessageBox" : "receiveMessageBox"}>{message.messageDivide}</div>
                            <div className="timeBox">{message.timeSplit}</div>
                        </div>

                    )
                })
                }


                <Input className="inputMessage"
                       placeholder="???????????? ???????????????.">
                </Input>

                <Button className="chatSendButton">
                    <SendOutlined />
                </Button>

            </Layout>




        </Layout>
    )







};


export default ChatPage;