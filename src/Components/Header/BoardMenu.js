import React from "react";
import {Dropdown,Menu,Tooltip,Input,Button,Badge,AutoComplete,Spin,Select} from "antd";
import {SearchOutlined,EyeInvisibleOutlined} from "@ant-design/icons"

const {Option} = AutoComplete;



 const BoardMenu = ({searchTickets,boardConf,showCol,searchVal,options,url,searching})=>{

    const [searchAction,setSearchAction]=React.useState("Filter");

    console.log(searchAction)


     const callSearchTickets=(e,searchAction)=>{
        let remote=false;
        if (searchAction==="Search"){
            remote=true;
        }
         searchTickets(e,remote)
     }

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
            <div className={`search`}>
                <Select
                    className={`searchSelectAction `}

                    options={[{value:"Filter",label:"Filter"},{value:"Search",label:"Search"}]}
                    onChange={(e)=>{setSearchAction(e); const val={target:{value:searchVal}}; callSearchTickets(val,e)}}
                    value={searchAction}
                ></Select>
                <AutoComplete
                    value={searchVal}
                    className={"searchField"}
                    dropdownClassName={"searchResults"}
                    options={ searchAction==="Search" && options && Array.isArray(options) && options.map(entry=>({
                        value:entry.value,
                        label:(
                            <div style={{width:"100%"}}
                                 onClick={()=>{
                                     const e={target:{value:""}}

                                     window.open(`${url}${entry.value}`, '_blank');
                                     callSearchTickets(e,searchAction)


                                 }
                                 }
                                 className={"searchResultOption"}
                            >
                                <div>
                                    <div key={`id-detail-1`} className={"searchResultOptionFieldId"}   >
                                        <h6 >ID</h6>
                                        <h5 >{entry.value}</h5>
                                    </div>
                                    {
                                        Object.keys(entry).filter(field=>field!=="value").map((field,index)=>(
                                            <div className={"searchResultOptionField"} key={`${entry[field]}-detail-${index}`}  >
                                                <h6 >{field}</h6>
                                                <h5 >{entry[field]}</h5>
                                            </div>

                                        ))

                                    }</div>

                            </div>

                        )
                    }))}
                >
                    <Spin spinning={searching}><Input placeholder="Search"  prefix={<SearchOutlined />} onChange={(e)=>{callSearchTickets(e,searchAction)} } /></Spin>

                </AutoComplete>
            </div>

        </div>
    )
}

export default BoardMenu
