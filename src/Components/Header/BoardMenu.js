import React from "react";
import {Dropdown,Menu,Tooltip,Input,Button,Badge} from "antd";
import {SearchOutlined,EyeInvisibleOutlined} from "@ant-design/icons"


 const BoardMenu = ({searchTickets,boardConf,showCol,searchVal})=>{




    return (
        <div className="menuBoardAction">

            {boardConf.hiddenCols.length>0 && (
            <div className="menuHiddenCols">

                <Dropdown

                    overlay={(<Menu>
                        {boardConf.hiddenCols.map((hiddenCol,index)=>(
                            <Menu.Item key={`hiddenCol-${index}`} onClick={()=>{
                                showCol(hiddenCol)
                            }}>
                                {hiddenCol}
                            </Menu.Item>
                        ))}

                    </Menu>)}
                    placement="bottomLeft"
                >
                    <Tooltip title={`${boardConf.hiddenCols.length} hidden column${(boardConf.hiddenCols.length>1?"s":"")}`}> <Badge size="small" count={boardConf.hiddenCols.length}  ><Button shape={"circle"} size="small" icon={<EyeInvisibleOutlined/>}></Button></Badge></Tooltip>
                </Dropdown>
            </div>)}
            <Input placeholder="Search" value={searchVal} prefix={<SearchOutlined />} onChange={searchTickets} />
        </div>
    )
}

export default BoardMenu
