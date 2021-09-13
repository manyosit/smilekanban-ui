import React,{useContext,useState} from "react";
import {Layout,Radio,message,Spin,Tag} from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import './App.css';
import ErrorHandler from "./util/ErrorHandler";
import {useDispatch,connect} from "react-redux";

import {useHistory} from "react-router-dom";
import {AuthContext} from "./util/Auth/AuthProvider";


import Ticket from "./Components/Ticket/Ticket";
import WorkLogs from "./Components/WorkLogs/WorkLogs";
import {getTickets,setQuery} from "./util/redux/asyncActions";

const {Header,Content}=Layout







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

function incObj(inc){
    return {
        assignee:inc.values["Assignee"],
        assignedGroup:inc.values["Assigned Group"] ,
        id:inc.values["Incident Number"] ,
        priority:inc.values["Priority"] ,
        submitDate:inc.values["Submit Date"] ,
        summary:inc.values["Description"]
    }
}

const select = state => {
    let sProps={}
    sProps.tickets=state.request.tickets;
    sProps.loading=state.request.loading;
    sProps.query=state.request.query;
    return sProps

}

function App(props) {
    const {tickets,loading,query}=props




    const dispatch=useDispatch();
    const history = useHistory();
    const userManager = useContext(AuthContext);
    const [columns, setColumns] = useState([]);
    const [showWorkLogs,setShowWorklogs]=useState(false);
    const [workLogInfos,setWorkLogInfos]=useState({});
    const [radioVal,setRadioVal]=useState("Assigned to me");


    React.useEffect(()=>{
        dispatch(setQuery({selection:"Assigned to me",history,userManager}))

    },[])

    React.useEffect(()=>{
      setColumns({
            [1]: {
                name: "Assigned",
                items: tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Assigned").map(e=>incObj(e)),
                count:tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Assigned").length
            },
            [2]: {
                name: "In Progress",
                items: tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="In Progress").map(e=>incObj(e)),
                count:tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="In Progress").length
            },
            [3]: {
                name: "Pending",
                items: tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Pending").map(e=>incObj(e)),
                count:tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Pending").length
            },
            [4]: {
                name: "Resolved",
                items: tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Resolved").map(e=>incObj(e)),
                count:tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Resolved").length
            },
            [6]: {
                name: "Cancelled",
                items: tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Cancelled").map(e=>incObj(e)),
                count:tickets && tickets.entries && tickets.entries.filter(e=>e.values.Status==="Cancelled").length
            }


        });
    },[tickets])


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
          <Layout>
              <Header style={{textAlign:"left"}}>
                  <Radio.Group
                    options={["Assigned to me","Assigned to my groups"]}
                    optionType={"button"}
                    value={radioVal}
                    onChange={(k)=>{
                        setRadioVal(k.target.value)
                        dispatch(setQuery({selection:k.target.value,history,userManager}))
                    }}
                  />
              </Header>
              <Content>
                  <Spin spinning={loading}>
                  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                      <DragDropContext
                          onDragEnd={result => onDragEnd(result, columns, setColumns)}
                      >
                          {Object.entries(columns).map(([columnId, column], index) => {

                              return (

                                  <div
                                      style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center"
                                      }}
                                      key={columnId}
                                  >
                                        <h2 >{column.name}<Tag color="blue" style={{top:"-3px", position:"relative", left:"3px"}}>{column.count}</Tag></h2>
                                  <div style={{ margin: 8 }}>
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
                                                              width: 250,
                                                              minHeight: 500
                                                          }}
                                                      >

                                                          {column.items && column.items.map((item, index) => {
                                                              return (
                                                                  <Draggable
                                                                      key={item.id}
                                                                      draggableId={item.id}
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
                                                                                      padding: snapshot.isDragging?5:0,
                                                                                      margin: "0 0 8px 0",
                                                                                      minHeight: "50px",
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
