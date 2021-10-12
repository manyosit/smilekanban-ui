import React from "react";
import {Card, Descriptions, Dropdown, Tag,Menu} from "antd";
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

function getTagColor(ticketConfig, tag) {
    if (ticketConfig && ticketConfig.header && ticketConfig.header.tagColorMapping) {
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
            return <Descriptions.Item label={cardLabel} span={3}>{moment(item[fieldName]).isValid()?moment(item[fieldName]).format(ticketConfig.dateFormat) : item[fieldName]}</Descriptions.Item>
        })
    }

    return(
    <Card
        title={<><Tag color={getTagColor(ticketConfig, item[ticketConfig.header.tagField])}>{item[ticketConfig.header.tagField]}</Tag>{item[ticketConfig.header.titleField]}</>}
        headStyle={{fontSize:"14px"}}
        extra={
            <Dropdown overlay={
                <Menu>
                    {
                        ticketConfig && ticketConfig.actions && Object.keys(ticketConfig.actions).map(action=>(
                            <Menu.Item>
                                <a href="#" onClick={()=>{menuAction(ticketConfig.actions[action],item)}}>
                                    {action}
                                </a>
                            </Menu.Item>
                            )

                        )
                    }


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
