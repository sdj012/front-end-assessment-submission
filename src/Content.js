import React from 'react';
import './App.css';
import './Student.css';

class Content extends React.Component {

  constructor(props){

    super(props);

    this.state={

      Students:[],
      filter_name:"",
      filter_tag:"",
    }


    this.handleChange=this.handleChange.bind(this);
    this.onKeyDown=this.onKeyDown.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);

    this.handleNameFilter=this.handleNameFilter.bind(this);
    this.handleTagFilter=this.handleTagFilter.bind(this);
    this.studentData=this.studentData.bind(this);

    this.displayMore=this.displayMore.bind(this);
    this.whileFilteredDisplayMore=this.whileFilteredDisplayMore.bind(this);
    this.filterValidObjects=this.filterValidObjects.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);
  
  }

  displayMore(event){

    let el=document.getElementById("hidden_" + event.target.id)
    let vert=document.getElementsByClassName("expand-btn_vert")[event.target.id-1]

    if(!el.style.display){
      el.style.display='block'
      vert.style.display='none'
    }

    else {
      el.style.display=''
      vert.style.display='table'
    }


  }

  whileFilteredDisplayMore(event){

    console.log(event.target.id)

    let el=document.getElementById("hidden_" + event.target.id)
    let vert=document.getElementsByClassName("expand-btn_vert")[event.target.id]

    if(!el.style.display){
      el.style.display='block'
      vert.style.display='none'
    }

    else {
      el.style.display=''
      vert.style.display='table'
    }


  }

  handleChange(event){

    event.preventDefault();

    this.setState({value:event.target.value})

  }

  onKeyDown(event){
    if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    this.handleSubmit(event);
    }
  } 


  handleSubmit(event){

  event.preventDefault();

  let newObj=Object.assign(this.state.Students);

  for(let i=0;i<newObj.length;i++){

    if(event.target.id==parseInt(newObj[i].id)){

      newObj[i].tags.push(this.state.value) 

    }

  }

  this.setState({
    Student:newObj,
  })

  }

  handleNameFilter(event){

    event.preventDefault();

    this.setState({
      filter_name:event.target.value
    })

  }

  handleTagFilter(event){

    event.preventDefault();

    this.setState({
      filter_tag:event.target.value
    })

  }

  studentData(data){

    let validIds=[]

    for( var i in data.students){

      let avg=0;
      data.students[i].grades.map(grade => avg+=parseInt(grade))
      avg=avg/data.students[i].grades.length

      validIds.push(
        {
        "photo": data.students[i].pic,
        "id": data.students[i].id,
        "firstName": data.students[i].firstName.toUpperCase(),
        "lastName": data.students[i].lastName.toUpperCase(),
        "email": data.students[i].email,
        "company": data.students[i].company,
        "skill": data.students[i].skill,
        "average":avg,
        "grades": data.students[i].grades,
        "tags":[],        
        }
      )

    }

    this.setState({
      Students:validIds
    })

  }

  componentDidMount(){

    fetch("https://www.hatchways.io/api/assessment/students")

    .then(response => response.json())
    .then(result=>this.studentData(result))
    .catch(error=>error);

  }

  filterValidObjects(){

    let validObjects=[];


    if(this.state.filter_name!="" && this.state.filter_tag==""){

      this.state.Students.map( student => {

        if(student.firstName.toUpperCase().indexOf(this.state.filter_name.toUpperCase())!==-1  || student.lastName.toUpperCase().indexOf(this.state.filter_name.toUpperCase())!==-1){

          
          validObjects.push(student)

        }
    
      })

    }

    if(this.state.filter_tag!="" && this.state.filter_name==""){

      this.state.Students.map( student => {

        student.tags.map( tag => {

          if(tag.toUpperCase().indexOf(this.state.filter_tag.toUpperCase())!==-1){

            validObjects.push(student)

          }
        })

      })
      
    }

    if(this.state.filter_tag!="" && this.state.filter_name!=""){

      this.state.Students.map( student => {

        if(student.firstName.toUpperCase().indexOf(this.state.filter_name.toUpperCase())!==-1  || student.lastName.toUpperCase().indexOf(this.state.filter_name.toUpperCase())!==-1){

          student.tags.map( tag => {

            if(tag.toUpperCase().indexOf(this.state.filter_tag.toUpperCase())!==-1){

              validObjects.push(student)

            }
          })

        }
    
      })
      
    }

    validObjects = [...new Set(validObjects)];

    return validObjects;
  }

  render(){
    
    if(this.state.filter_name || this.state.filter_tag){
            
      return(

        
        <div className="App">

        <div className="content">
          
          <div className="filters">

            <input type="text" placeholder="Search by name" id="name-input" value={this.state.filter_name} onChange={this.handleNameFilter}/>
                  
            <input type="text" placeholder="Search by tags" id="tag-input" value={this.state.filter_tag} onChange={this.handleTagFilter}/>
          
          </div>

        <div className="student_list">

        {this.filterValidObjects().map((student,index) => 
          
          <div className="Student">

            <div className="photo">
              <div className="photoContainer">
                <img src={student.photo}></img>
              </div>
            </div>
    
            <div className="data">

              <p id="name">{student.firstName} {student.lastName}</p>
              <p>Email: {student.email}</p>
              <p>Company: {student.company}</p>
              <p>Skill: {student.skill}</p>
              <p>Average: {student.average}%</p>
              <br></br>

                <div id={"hidden_" + index}>

                  <p className="tests">{student.grades.map( (test,index) => <p>Test {index+1} : {test}%</p> )}</p>
                  
                  {student.tags.map(tag=>
                    <div className="tag"><p>{tag}</p></div>

                  )}
          
                  <form>
                    <input type="text" id={student.id} className="add-tag-input" placeholder="Add a Tag" onKeyDown={this.onKeyDown} onChange={this.handleChange}></input>
                  </form>

                </div>

            </div>
    
            <div className="expand-btn" id={index} onClick={this.whileFilteredDisplayMore}><div className="expand-btn_vert" id={index}></div></div>

        </div>

      )}

             </div>
          </div>
        </div>
      )
    }
    
      
    else return (

      <div className="App">

        <div className="content">
        
          <div className="filters">
          
            <input type="text" id="name-input" placeholder="Search by name" onChange={this.handleNameFilter}/>
                  
            <input type="text" id="tag-input" placeholder="Search by tags" onChange={this.handleTagFilter}/>

          </div>

        <div className="student_list">
        
          {this.state.Students.map(student =>

            <div className="Student">

              <div className="photo">
                <div className="photoContainer">
                  <img src={student.photo}></img>
                </div>
              </div>


            <div className="data">

              <p id="name">{student.firstName} {student.lastName}</p>
              <p>Email: {student.email}</p>
              <p>Company: {student.company}</p>
              <p>Skill: {student.skill}</p>
              <p>Average: {student.average}%</p>
              <br></br>

              <div id={"hidden_" + student.id}>

                <p className="tests">{student.grades.map( (test,index) => <p>Test {index+1} : {test}%</p> )}</p>
                
                {student.tags.map(tag=>
                    
                    <div className="tag"><p>{tag}</p></div>

                )}
        
                <form>
                  <input type="text" id={student.id} className="add-tag-input" placeholder="Add a Tag" onChange={this.handleChange} onKeyDown={this.onKeyDown}></input>
                </form>

              </div>

            </div>

            <div className="expand-btn" id={student.id} onClick={this.displayMore}><div className="expand-btn_vert" id={student.id}></div></div>
        
        </div> 

        )}

        </div>
      </div>
    </div>
    );
  }
}

export default Content;
