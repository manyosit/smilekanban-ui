import React from "react";
import {Card, Descriptions, Dropdown, Tag,Menu} from "antd";
import { DownOutlined } from '@ant-design/icons';


function getPrioColor(prio){
    let color;
    switch (prio){
        case "Critical":
            color="red";
            break;
        case "High":
            color="orange";
            break;
        case "Medium":
            color="gold";
            break;
        case "Low":
            color="green";
            break;
        default:
            color="red";
            break;
    }
    return color;
}


const Ticket=(props)=>{

    const {item,menuAction}=props

    return(
    <Card
        title={<><Tag color={getPrioColor(item.priority)}>{item.priority}</Tag>{item.id}</>}
        headStyle={{fontSize:"14px"}}
        extra={
            <Dropdown overlay={
                <Menu>
                <Menu.Item>
                    <a href="#" onClick={()=>{menuAction("worklogs",item)}}>
                        Show Worklogs
                    </a>
                </Menu.Item>
                <Menu.Item >
                    <a  href="#" onClick={()=>{menuAction("reassign")}}>
                        Reassign
                    </a>
                </Menu.Item>
                <Menu.Item >
                    <a   href="#" >
                        Open in SmartIT
                    </a>
                </Menu.Item>

            </Menu>}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                     <DownOutlined />
                </a>
            </Dropdown>
        }
        bodyStyle={{padding:0}}
    >
        <Descriptions  bordered size={"small"} contentStyle={{fontSize:"10px"}} labelStyle={{fontSize:"10px"}}>
            <Descriptions.Item label="Summary" span={3}>{item.summary}</Descriptions.Item>
            <Descriptions.Item label="Assigned Group"span={3}> {item.assignedGroup}</Descriptions.Item>
            <Descriptions.Item label="Assignee"span={3}>{item.assignee}</Descriptions.Item>
            <Descriptions.Item label="Created"span={3}>{item.submitDate}</Descriptions.Item>

        </Descriptions>
    </Card>
    )
}

 export default Ticket
