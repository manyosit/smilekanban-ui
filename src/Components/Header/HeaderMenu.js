import React from "react";
import {Select,Input,Autocomplete} from "antd"
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {FilterOutlined,TableOutlined } from "@ant-design/icons"
import BoardMenu from "./BoardMenu"

import {setQuery} from "../../util/redux/asyncActions";

const {Option}=Select;

const HeaderMenu=({configs,id,ticketConfig,userManager,setRadioVal,searchTickets,boardConf,showCol,searchVal,searchResults,searching})=>{

    const history=useHistory();
    const dispatch=useDispatch();


    return (
        <div  className={"headerMenuHolder"} >

            <div className={"headerMenuSelect"}>

                <Input disabled={true} prefix={<TableOutlined />}  className={"SelectPrefix"}/>
                <Select defaultValue="incident" options={configs} onChange={(k)=>{
                    history.push(`/kanban/${k}`)

                }} value={id}>



                </Select>
            </div>


            <div className={"headerMenuSelect"}>
                <Input disabled={true} prefix={<FilterOutlined/>} className={"SelectPrefix"}/>
                <Select defaultValue="Assigned to me" onChange={(k)=>{
                    setRadioVal(k)

                    dispatch(setQuery({selection:k, ticketConfig, history, userManager}))

                }}

                >
                    <Option value="Assigned to me">Assigned to me</Option>
                    <Option value="Assigned to my groups">Assigned to my groups</Option>

                </Select>
            </div>


                <BoardMenu
                    searchTickets={searchTickets}
                    boardConf={boardConf}
                    showCol={showCol}
                    searchVal={searchVal}
                    options={searchResults}
                    url={ticketConfig && ticketConfig.searchDetailUrl}
                    searching={searching}

                />



        </div>
    )
}
export default HeaderMenu
