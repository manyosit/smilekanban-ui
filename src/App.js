import React,{useContext,useState,useCallback} from "react";
import {EyeInvisibleOutlined } from "@ant-design/icons"
import {Layout,message,Spin,Tag,Select,Button,Tooltip} from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import './App.css';
import ErrorHandler from "./util/ErrorHandler";
import HeaderMenu from "./Components/Header/HeaderMenu"
import {useDispatch,connect} from "react-redux";
import _ from "lodash";

import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "./util/Auth/AuthProvider";


import Ticket from "./Components/Ticket/Ticket";
import WorkLogs from "./Components/WorkLogs/WorkLogs";
import StatusFields from "./Components/StatusFields/StatusFields";
import {setQuery, setTicketConfig,saveTicket,createWorklog,getTicketWorklogs,getConfigs,searchInRemedy} from "./util/redux/asyncActions";
import {useWindowSize} from "./util/useWindowSize"
import {translateQuery} from "./util/componentUtils"

const {Content}=Layout




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
    sProps.configs=state.request.configs;
    sProps.searchResults=state.request.searchResults;
    sProps.searching=state.request.searching;
    return sProps

}

const loadSettings = ()=>{
    return JSON.parse(localStorage.getItem("smilekanban"))

}

const saveSettings = (config,id)=>{

    let newConf=loadSettings()||{}
    newConf[id]=config

    localStorage.setItem("smilekanban",JSON.stringify(newConf))
}

function App(props) {
    const {tickets,loading,query, ticketConfig,configs,searchResults,searching}=props
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
    const [boardConf,setBoardConf]= useState(()=>{
        const conf=loadSettings()
        if (conf && conf[id] ){
           return conf[id]
        }
       return {hiddenCols:[]}
    });
    const [searchVal,setSearchVal]=useState("");
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
                    const fieldConstants=ticketConfig.columns[destColumn.name].fieldConstants

                    dispatch(saveTicket({ item:columns[source.droppableId].items[source.index],ticketConfig,fields:{...fieldConstants},status:columns[destination.droppableId].name, history,userManager }))
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
        ticketConfig && dispatch(setQuery({selection:radioVal, ticketConfig, history, userManager}))
    },[ticketConfig])

    React.useEffect(()=>{
        dispatch(getConfigs({ history, userManager}))
    },[])

    React.useEffect(()=>{


            dispatch(setTicketConfig({id, history, userManager}))
            const conf = loadSettings()
            if (conf && conf[id]){
                setBoardConf(conf[id])
            }else{
                setBoardConf({hiddenCols:[]})
            }

        setSearchVal("")

    },[id])

    React.useEffect(()=>{

        if (boardConf && Object.keys(boardConf).length>0){
            saveSettings(boardConf,id)
        }


    },[boardConf])

    const hideCol = (column)=>{

        if (boardConf.hiddenCols.indexOf(column)<0){

            setBoardConf( {...boardConf,hiddenCols:[...boardConf.hiddenCols,column]})
        }


    }

    const showCol = (column)=>{
        setBoardConf( {...boardConf,hiddenCols:boardConf.hiddenCols.filter(c=>c!==column)})



    }

    const sortTickets=(a,b,ticketConfig)=>{
            const sortBy = ticketConfig.priorityField
            return  intPrio(a[sortBy])-intPrio(b[sortBy])

    }

    function filterTickets(tickets, status,ticketConfig) {
        if (tickets && tickets.entries && Array.isArray(tickets.entries)) {
            return tickets.entries.filter(e=>e.values[ticketConfig.columnField]===status).map(e=>e.values).sort((a,b)=>{sortTickets(a,b,ticketConfig)})
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
                    items: filterTickets(tickets, colConfigName,ticketConfig),
                    count: filterTickets(tickets, colConfigName,ticketConfig).length
                }
                colNumber++
            })
        }
        return colDef
    }

    React.useEffect(()=>{
      setColumns(getColumnDef(ticketConfig, tickets));
    },[tickets, ticketConfig])



    const searchTickets=(e,remote)=>{


        setSearchVal(e.target.value)
        if (tickets && ticketConfig && ticketConfig.searchFields && Array.isArray(ticketConfig.searchFields)){
            delayedQuery(e.target.value,tickets,ticketConfig,remote)
        }

    }

    const delayedQuery = React.useCallback(
        _.debounce((q,tickets,ticketConfig,remote) => {

          let filtered={...tickets};

          if (filtered && filtered.entries && Array.isArray(filtered.entries) ){

              filtered.entries=filtered.entries.filter(e=>
                   ticketConfig.searchFields.map(searchField=>

                          e.values && e.values[searchField] && e.values[searchField].toLowerCase().indexOf(q.toLowerCase())>=0


                  ).indexOf(true)>=0


              )

              setColumns(getColumnDef(ticketConfig, filtered));
          }else{
              console.error("NO TICKETS",filtered)
          }
          if(remote){
              dispatch(searchInRemedy({value:q,module:id,config:ticketConfig,history,userManager}))
          }




        }, 500),
        [], // will be created only once initially
    );

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
            <div className="headMenu"  />
            <img src="/logo.png" className="headMenuLogo" />
            <HeaderMenu
                configs={configs}
                id={id}
                ticketConfig={ticketConfig}
                userManager={userManager}
                setRadioVal={setRadioVal}
                searchTickets={searchTickets}
                boardConf={boardConf}
                showCol={showCol}
                searchVal={searchVal}
                searchResults={searchResults}
                searching={searching}

            />



          <Layout>

              <Content style={{height:`${(size ? size.height-55 : 500)}px`,overflowY:'scroll'}}>
                  <Spin spinning={loading}>

                      <div style={{ /*justifyContent: "center",*/ height: size ? size.height-55 : 0,display:"flex" }} className={"boardColumns"}>
                          <DragDropContext
                              onDragEnd={result => onDragEnd(result, columns, setColumns)}
                              onBeforeDragStart={result=>setBlocked(false)}
                              onDragUpdate={result => onDragUpdate(result, columns, setColumns)}
                          >
                              {Object.entries(columns).filter(([columnId, column])=>boardConf.hiddenCols.indexOf(column.name)<0).map(([columnId, column], index) => {

                                  return (
                                  <div key={`columnHolder-${index}`}>
                                    <div  className="stateCol">
                                        <h4  onClick={()=>{

                                            //HIDE / DISPLAY COLUMNS DEPRICATED
                                            /*var displayVal;
                                            if (columnWidth[column.name]==="block"){
                                                displayVal="small"
                                            }else{
                                                displayVal="block"
                                            }
                                            setColumnWidth({...columnWidth,[column.name]:displayVal})*/
                                        }}

                                        className="colHeader"
                                        >
                                            {  column.name}

                                            <Tooltip title={"Columns ticket count"}>
                                                <Tag color={ticketConfig && ticketConfig.header.columnCountColor} className="columnHeaderPriority" >{column.count}</Tag>
                                            </Tooltip>

                                            <Tooltip title={"Hide Column"}>
                                                <Button shape="circle" icon={<EyeInvisibleOutlined/>} size={"small"} onClick={()=>{hideCol(column.name)}}></Button>
                                            </Tooltip>

                                        </h4>

                                                <div
                                                    className="colBody"
                                                    key={columnId}
                                                >


                                                    <div style={{ margin: 1 }}>
                                                        <Droppable droppableId={columnId} key={columnId}>
                                                            {(provided, snapshot) => {
                                                                //const calcSize = (size.width - 30*Object.keys(columnWidth).filter(e=>columnWidth[e]==="small").length)/Object.keys(columnWidth).filter(e=>columnWidth[e]==="block").length

                                                                return (


                                                                    <div
                                                                        className={`droppableCard ${blocked?"droppableCardBlocked":""} ${snapshot.isDraggingOver?"droppableCardDraggingOver":""}`}
                                                                        {...provided.droppableProps}
                                                                        ref={provided.innerRef}
                                                                        style={{
                                                                           /* background: snapshot.isDraggingOver && !blocked
                                                                                ? "lightblue"
                                                                                : snapshot.isDraggingOver && blocked ? "#f7a4a4":"white",

                                                                            cursor:blocked ? "not-allowed": "grab",*/
                                                                            maxHeight: size ? size.height-120 : 0,
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
                                                                                                className={`draggableCard ${snapshot.isDragging?"draggableCardDragging":""}`}
                                                                                                style={{

                                                                                                    /*border:snapshot.isDragging?"#d9363e 1px solid!important":"none",
                                                                                                    backgroundColor: snapshot.isDragging
                                                                                                        ? "orange"
                                                                                                        : "white",*/

                                                                                                    ...provided.draggableProps.style
                                                                                                }}
                                                                                            >
                                                                                                <Ticket
                                                                                                    key={`ticket-item[ticketConfig.idField]-${index}`}
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


                                    </div>
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
                          ticketConfig={ticketConfig}
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
