import React,{useContext,useState} from "react";
import {FilterOutlined,FileSearchOutlined } from "@ant-design/icons"
import {Layout,message,Spin,Tag,Select} from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import './App.css';
import ErrorHandler from "./util/ErrorHandler";
import {useDispatch,connect} from "react-redux";

import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "./util/Auth/AuthProvider";


import Ticket from "./Components/Ticket/Ticket";
import WorkLogs from "./Components/WorkLogs/WorkLogs";
import {getTickets,setQuery, setTicketConfig} from "./util/redux/asyncActions";

const {Content}=Layout
const {Option}=Select

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        });
    }
};

const intPrio=(strPrio)=>{

    let prio;
    switch(strPrio){
        case "Critical":
            prio=0
            break;
        case "High":
            prio=1
            break;
        case "Medium":
            prio=2
            break;
        case "Low":
            prio=4
            break;
        default:
            break;
    }
    return prio
}

const select = state => {
    let sProps={}
    sProps.tickets=state.request.tickets;
    sProps.loading=state.request.loading;
    sProps.query=state.request.query;
    sProps.ticketConfig=state.request.ticketConfig;
    return sProps

}

function App(props) {
    const {tickets,loading,query, ticketConfig}=props
    let {id} = useParams();


    const dispatch=useDispatch();
    const history = useHistory();
    const userManager = useContext(AuthContext);
    const [columns, setColumns] = useState([]);
    const [showWorkLogs,setShowWorklogs]=useState(false);
    const [workLogInfos,setWorkLogInfos]=useState({});
    const [radioVal,setRadioVal]=useState("Assigned to me");
    const [columnWidth,setColumnWidth] = useState({})

    React.useEffect(()=>{
        const colDef = {}
        ticketConfig && ticketConfig.columns && Object.keys(ticketConfig.columns).forEach(
            colConfigName => {

                colDef[colConfigName] = "block"


            })

        setColumnWidth(colDef)
    },[ticketConfig])

    React.useEffect(()=>{
        dispatch(setTicketConfig({id, history, userManager}))
    },[])

    React.useEffect(()=>{
        dispatch(setQuery({selection:"Assigned to me", ticketConfig, history, userManager}))
    },[])


    const sortTickets=(a,b)=>{
        if ((a.priority)===b.priority) {
            return b.submitDate - a.submitDate
        }else{
            return  intPrio(a.priority)-intPrio(b.priority)
        }
    }

    function filterTickets(tickets, status) {
        if (tickets && tickets.entries && Array.isArray(tickets.entries)) {
            return tickets.entries.filter(e=>e.values.Status===status).map(e=>e.values).sort(sortTickets)
        } else {
            return []
        }
    }

    function getColumnDef(ticketConfig, tickets) {
        let colNumber = 1
        const colDef = {}
        if (ticketConfig && ticketConfig.columns) {
            Object.keys(ticketConfig.columns).forEach(colConfigName => {
                colDef[colNumber] = {
                    name: colConfigName,
                    items: filterTickets(tickets, colConfigName),
                    count: filterTickets(tickets, colConfigName).length
                }
                colNumber++
            })
        }
        return colDef
    }

    React.useEffect(()=>{
      setColumns(getColumnDef(ticketConfig, tickets));
    },[tickets, ticketConfig])


    const menuAction=(action,item)=>{

        switch(action){
            case "worklogs":
                setShowWorklogs(true);
                setWorkLogInfos(item);
                break;
            default:
                message.info("comming soon")
                break;

        }


    }
    const handleClose=()=>{
        setShowWorklogs(false);
    }

  return (
      <ErrorHandler>
        <div className="App">
            <div className="headMenu" style={{  height:"55px",background:"#646464"}} />
            <img src="/logo.png" style={{maxHeight:"50px",left:20,top:0, position:"absolute"}}/>
            <div  style={{  padding: "10px",position:"absolute",right:5,top:0}} >

                <FileSearchOutlined style={{margin:"10px"}} />
                <Select defaultValue="HPD:Help Desk" style={{ width: 300}} onChange={(k)=>{
                    console.log(k);
                }}>
                    <Option value="HPD:Help Desk">Incident</Option>


                </Select>
                <FilterOutlined style={{margin:"10px"}}/>
                <Select defaultValue="Assigned to me" style={{ width: 300}} onChange={(k)=>{
                    setRadioVal(k)
                    dispatch(setQuery({selection:k, ticketConfig, history, userManager}))
                }}>
                    <Option value="Assigned to me">Assigned to me</Option>
                    <Option value="Assigned to my groups">Assigned to my groups</Option>

                </Select>
            </div>



          <Layout>

              <Content>
                  <Spin spinning={loading}>
                  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                      <DragDropContext
                          onDragEnd={result => onDragEnd(result, columns, setColumns)}
                      >
                          {Object.entries(columns).map(([columnId, column], index) => {

                              return (
                                <div >
                                    <h4  onClick={()=>{
                                        var displayVal;
                                        if (columnWidth[column.name]==="block"){
                                            displayVal="small"
                                        }else{
                                            displayVal="block"
                                        }
                                        setColumnWidth({...columnWidth,[column.name]:displayVal})
                                    }}
                                    style={{display:"tablecell",float:"none",cursor:"pointer",marginTop:"8px", borderLeft:"2px solid white"}}
                                    >
                                        { (columnWidth[column.name] === "block") && column.name}<Tag color="blue" style={{top:"-2px", position:"relative", left:(columnWidth[column.name] === "block")?"12px":"3px"}}>{column.count}</Tag>

                                    </h4>
                                    {
                                        (columnWidth[column.name] === "block")
                                       ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",

                                                }}
                                                key={columnId}
                                            >


                                                <div style={{ margin: 1,borderTop:"1px solid #80808073" }}>
                                                    <Droppable droppableId={columnId} key={columnId}>
                                                        {(provided, snapshot) => {
                                                            return (


                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{
                                                                        background: snapshot.isDraggingOver
                                                                            ? "lightblue"
                                                                            : "lightgrey",
                                                                        padding: 4,
                                                                        width: (window.innerWidth - 30*Object.keys(columnWidth).filter(e=>columnWidth[e]==="small").length)/Object.keys(columnWidth).filter(e=>columnWidth[e]==="block").length,

                                                                        minHeight: window.innerHeight-97
                                                                    }}
                                                                >

                                                                    {column.items && column.items.map((item, index) => {
                                                                        return (
                                                                            <Draggable
                                                                                key={item[ticketConfig.idField]}
                                                                                draggableId={item[ticketConfig.idField]}
                                                                                index={index}
                                                                            >
                                                                                {(provided, snapshot) => {
                                                                                    return (
                                                                                        <div
                                                                                            ref={provided.innerRef}
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            style={{
                                                                                                userSelect: "none",

                                                                                                margin: "0 0 20px 0",
                                                                                                minHeight: "50px",
                                                                                                borderColor:"orange",
                                                                                                border:snapshot.isDragging?"#d9363e 1px solid!important":"none",
                                                                                                backgroundColor: snapshot.isDragging
                                                                                                    ? "orange"
                                                                                                    : "white",
                                                                                                color: "white",
                                                                                                ...provided.draggableProps.style
                                                                                            }}
                                                                                        >
                                                                                            <Ticket
                                                                                                item={item}
                                                                                                menuAction={menuAction}
                                                                                                ticketConfig={ticketConfig}
                                                                                            />


                                                                                        </div>
                                                                                    );
                                                                                }}
                                                                            </Draggable>
                                                                        );
                                                                    })}
                                                                    {provided.placeholder}
                                                                </div>

                                                            );

                                                        }}

                                                    </Droppable>
                                                </div>

                                            </div>
                                        )
                                            :(
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",

                                                    }}
                                                    key={columnId}
                                                >
                                                    <div

                                                        style={{
                                                            textOrientation:"sideways",
                                                            writingMode:"vertical-rl",
                                                            background: "lightgrey",
                                                            padding: 4,
                                                            marginTop:1,
                                                            minHeight: window.innerHeight-97
                                                        }}
                                                    >
                                                        {column.name}
                                                </div>
                                                </div>
                                            )
                                    }

                                </div>
                              );
                          })}
                      </DragDropContext>
                  </div>

                <WorkLogs
                    visible={showWorkLogs}
                    handleClose={handleClose}
                    item={workLogInfos}
                />
                  </Spin>
              </Content>
          </Layout>
        </div>
      </ErrorHandler>
  );
}

export default connect(select)(App)
