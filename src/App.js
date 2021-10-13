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
import StatusFields from "./Components/StatusFields/StatusFields";
import {getTickets,setQuery, setTicketConfig,saveTicket,createWorklog,getTicketWorklogs,getConfigs} from "./util/redux/asyncActions";
import {useWindowSize} from "./util/useWindowSize"
import {translateQuery} from "./util/componentUtils"

const {Content}=Layout
const {Option}=Select



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
    sProps.configs=state.request.configs
    return sProps

}

function App(props) {
    const {tickets,loading,query, ticketConfig,configs}=props
    let {id} = useParams();


    const dispatch=useDispatch();
    const history = useHistory();
    const userManager = useContext(AuthContext);
    const [columns, setColumns] = useState([]);
    const [showWorkLogs,setShowWorklogs]=useState(false);
    const [workLogInfos,setWorkLogInfos]=useState({});
    const [statusFields,setStatusFields]=useState([]);
    const [statusWorklogs,setStatusWorklogs]=useState(false);
    const [statusFieldsConstants,setStatusFieldsConstants]=useState([]);
    const [radioVal,setRadioVal]=useState("Assigned to me");
    const [columnWidth,setColumnWidth] = useState({})
    const [blocked,setBlocked] = useState(false)
    const [showStatusFields,setShowStatusFields] = useState(false);
    const [movedItem,setMovedItem] = useState(undefined);
    const [newStatus,setNewStatus] = useState(undefined);
    const size=useWindowSize();


    const allowedStatus=(source,destination)=>{
        if (destination && destination.droppableId && source && source.droppableId){
            const sourceCol=columns[source.droppableId].name;
            const targetCol=columns[destination.droppableId].name;
            if (ticketConfig && ticketConfig.columns && ticketConfig.columns[sourceCol] && ticketConfig.columns[sourceCol].allowedStatus){
                return ticketConfig.columns[sourceCol].allowedStatus.some(e=>e.indexOf(targetCol)>=0)

            }

        }
    };
    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            if (!allowedStatus(source,destination)){
                message.error("Not Allowed")
            }else{
                setMovedItem(columns[source.droppableId].items[source.index])
                setNewStatus(columns[destination.droppableId].name)
                const sourceColumn = columns[source.droppableId];
                const destColumn = columns[destination.droppableId];
                const sourceItems = [...sourceColumn.items];
                const destItems = [...destColumn.items];
                const [removed] = sourceItems.splice(source.index, 1);

                
                if (destColumn.name && ticketConfig && ticketConfig.columns &&  ticketConfig.columns[destColumn.name] &&  ticketConfig.columns[destColumn.name].fields && Array.isArray(ticketConfig.columns[destColumn.name].fields)  && ticketConfig.columns[destColumn.name].fields.length>0 ){
                    setShowStatusFields(true);
                    setStatusFields(ticketConfig.columns[destColumn.name].fields);
                    if (ticketConfig.columns[destColumn.name].fieldConstants){
                        setStatusFieldsConstants(ticketConfig.columns[destColumn.name].fieldConstants);
                    }else{
                        setStatusFieldsConstants({});
                    }
                    if (ticketConfig.columns[destColumn.name].worklogs){
                       
                        setStatusWorklogs(ticketConfig.columns[destColumn.name].worklogs)
                    }else{
                        setStatusWorklogs(false)
                    }

                }else{
                    setStatusFields([]);

                    dispatch(saveTicket({ item:columns[source.droppableId].items[source.index],ticketConfig,fields:[],status:columns[destination.droppableId].name, history,userManager }))
                }

                destItems.splice(destination.index, 0, removed);
                /*setColumns({
                    ...columns,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems
                    },
                    [destination.droppableId]: {
                        ...destColumn,
                        items: destItems
                    }
                });*/
            }

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
    const onDragUpdate = (result, columns) => {

        const { source, destination } = result;


        if (!allowedStatus(source,destination)){
            setBlocked(true)
        }else{
           setBlocked(false)
        }



    };
    React.useEffect(()=>{
        const colDef = {}
        ticketConfig && ticketConfig.columns && Object.keys(ticketConfig.columns).forEach(
            colConfigName => {

                colDef[colConfigName] = "block"


            })

        setColumnWidth(colDef)

        ticketConfig && dispatch(setQuery({selection:radioVal, ticketConfig, history, userManager}))
    },[ticketConfig])

    React.useEffect(()=>{
        dispatch(getConfigs({ history, userManager}))
    },[])

    React.useEffect(()=>{


            dispatch(setTicketConfig({id, history, userManager}))


    },[id])





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

        switch(action.type){
            case "worklogs":
                setShowWorklogs(true);
                dispatch(getTicketWorklogs({item,worklogConfig:ticketConfig.worklogs,history,userManager}))
                setWorkLogInfos(item);

                break;
            case "open":
                let url=translateQuery(action.url,item)
                window.open(url, '_blank').focus();
                break;
            case "fieldUpdate":
                    setShowStatusFields(true)
                    setStatusFields(action.fields)
                    setMovedItem(item)
                    setNewStatus(undefined)
                    setStatusFieldsConstants(action.fieldConstants)
                    setStatusWorklogs(action.worklogs)
                                
                break;
            default:
                message.info("comming soon")
                break;

        }


    }
    const handleCloseWorkLogs=()=>{
        setShowWorklogs(false);
    }
    const handleCloseFields=({item,fields,status,worklogConfig,wlFields})=>{

        dispatch(saveTicket({ item,ticketConfig,fields,status, history,userManager }))
        if (wlFields && Object.keys(wlFields).length>0 && worklogConfig){
            dispatch(createWorklog({ item,worklogConfig,wlFields, history,userManager }))
        }
       
        setShowStatusFields(false);
    }

  return (
      <ErrorHandler>
        <div className="App">
            <div className="headMenu" style={{  height:"55px",background:"#646464"}} />
            <img src="/logo.png" style={{maxHeight:"50px",left:20,top:0, position:"absolute"}}/>
            <div  style={{  padding: "10px",position:"absolute",right:5,top:0}} >

                <FileSearchOutlined style={{margin:"10px",color:"#b9b9b9"}} />
                <Select defaultValue="incident" style={{ width: 300}} options={configs.map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}))} onChange={(k)=>{
                    history.push(`/kanban/${k}`)

                }} value={id}>



                </Select>
                <FilterOutlined style={{margin:"10px",color:"#b9b9b9"}}/>
                <Select defaultValue="Assigned to me" style={{ width: 300}} onChange={(k)=>{
                    setRadioVal(k)

                    dispatch(setQuery({selection:k, ticketConfig, history, userManager}))

                }}

                >
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
                          onBeforeDragStart={result=>setBlocked(false)}
                          onDragUpdate={result => onDragUpdate(result, columns, setColumns)}
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
                                    style={{display:"tablecell",
                                        float:"none",
                                        cursor:"pointer",
                                        paddingTop:"8px",
                                        paddingBottom: "7px",
                                        margin: "0px -1px 0px 0px",
                                        borderRight:"2px solid white",
                                        boxShadow: "0px 1px lightgray"

                                    }}
                                    >
                                        { (columnWidth[column.name] === "block") && column.name}<Tag color={ticketConfig && ticketConfig.header.columnCountColor} style={{top:"-2px", position:"relative", left:(columnWidth[column.name] === "block")?"12px":"3px"}}>{column.count}</Tag>

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
                                                            const calcSize = (size.width - 30*Object.keys(columnWidth).filter(e=>columnWidth[e]==="small").length)/Object.keys(columnWidth).filter(e=>columnWidth[e]==="block").length
                                                            const blockSize = (calcSize<250)?250:calcSize
                                                            return (


                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{
                                                                        background: snapshot.isDraggingOver && !blocked
                                                                            ? "lightblue"
                                                                            : snapshot.isDraggingOver && blocked ? "#f7a4a4":"lightgrey",
                                                                        padding: 4,
                                                                        width: calcSize,
                                                                        cursor:blocked ? "not-allowed": "grab",
                                                                        minHeight: size.height-97
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

                                                                                                margin: "0 0 4px 0",
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
                                                            minHeight: size.height-97,
                                                            borderTop:"1px solid rgba(128, 128, 128, 0.05);"
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
                    handleClose={handleCloseWorkLogs}
                    history={history}
                    userManager={userManager}
                    item={workLogInfos}
                />
                  <StatusFields
                      visible={showStatusFields}
                      handleClose={handleCloseFields}
                      fields={statusFields}
                      item={movedItem}
                      status={newStatus}
                      constants={statusFieldsConstants}
                      worklogs={statusWorklogs}
                      worklogConfig={ticketConfig && ticketConfig.worklogs}
                  />
                  </Spin>
              </Content>
          </Layout>
        </div>
      </ErrorHandler>
  );
}

export default connect(select)(App)
