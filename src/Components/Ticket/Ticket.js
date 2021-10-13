import React from "react";
import {Card, Descriptions, Dropdown, Tag,Menu,Row,Col,Avatar,Tooltip} from "antd";
import { DownOutlined,CommentOutlined } from '@ant-design/icons';
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

    const [expand,setExpand] = React.useState(false);

    let listItems = []
    if (ticketConfig && ticketConfig.columns) {
        listItems = Object.keys(ticketConfig.cardFields).map((cardLabel) => {
            const fieldName = ticketConfig.cardFields[cardLabel]
            return <Descriptions.Item label={cardLabel} span={3}>{moment(item[fieldName]).isValid()?moment(item[fieldName]).format(ticketConfig.dateFormat) : item[fieldName]}</Descriptions.Item>
        })
    }

    return(
    <Card
        title={<div className={"ticketHeader"} style={{marginLeft:"0px"}}><Tag color={getTagColor(ticketConfig, item[ticketConfig.header.tagField])}>{item[ticketConfig.header.tagField]}</Tag><Tooltip title={item[ticketConfig.header.titleField]}><h5 className={"ticketTitle"} style={{display:"inline-block"}}>{item[ticketConfig.header.titleField]}</h5></Tooltip></div>}
        headStyle={{fontSize:"14px"}}

        size={"small"}
        onClick={()=>{setExpand(!expand)}}
        actions={[
            (ticketConfig.Assignee) && <Tooltip title={item[ticketConfig.Assignee.field]}><Avatar size={20} key="user" onClick={()=>{menuAction(ticketConfig.Assignee.action,item)}}>{
                item[ticketConfig.Assignee.field] && item[ticketConfig.Assignee.field].split(" ").map(e=>e.charAt(0).toUpperCase()).join("")

            }</Avatar></Tooltip>,
            (ticketConfig.worklogs) && <CommentOutlined key="worklogs" onClick={()=>{menuAction({type:"worklogs"},item)}}/>,
        ]}
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
        <div className={"ticketCard-"+(expand?"open":"closed")}>
        {
            expand
            ? <Descriptions  bordered size={"small"} contentStyle={{fontSize:"10px"}} labelStyle={{fontSize:"10px"}}>
                {listItems}
            </Descriptions>
                : <div style={{textAlign:"left", margin:"2px 8px"}} ><h5 >{Object.keys(ticketConfig.cardFields)[0]}</h5>
                  <h6 >{item[ticketConfig.cardFields[Object.keys(ticketConfig.cardFields)[0]]]}</h6></div>
        }
        </div>
    </Card>
    )
}

 export default Ticket
