import React from "react";
import {Card, Descriptions, Dropdown, Tag,Menu} from "antd";
import { DownOutlined } from '@ant-design/icons';


function getTagColor(ticketConfig, tag) {
    if (ticketConfig && ticketConfig.header && ticketConfig.header.tagColorMapping) {
        console.log(tag)
        return ticketConfig.header.tagColorMapping[tag] || ticketConfig.header.tagColorMapping['default'] || 'blue'
    } else {
        return "blue"
    }
}


const Ticket=(props)=>{

    const {item, menuAction, ticketConfig}=props
    let listItems = []
    if (ticketConfig && ticketConfig.columns) {
        listItems = Object.keys(ticketConfig.cardFields).map((cardLabel) => {
            const fieldName = ticketConfig.cardFields[cardLabel]
            return <Descriptions.Item label={cardLabel} span={3}>{item[fieldName]}</Descriptions.Item>
        })
    }

    return(
    <Card
        title={<><Tag color={getTagColor(ticketConfig, item[ticketConfig.header.tagField])}>{item[ticketConfig.header.tagField]}</Tag>{item[ticketConfig.header.titleField]}</>}
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
            {listItems}
        </Descriptions>
    </Card>
    )
}

 export default Ticket
