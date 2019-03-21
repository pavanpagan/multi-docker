import React,{Component} from 'react';
import axios  from 'axios';
// import {Panel,Modal,Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap';
let api='http://localhost:5000';
class Fib extends Component{
constructor(props)
{
    super(props);

    this.state={

        seenIndexes:[],
        values:{},
        index:'',
        items:{
            itemstatus:{value:'available',valid:true}
        },

    }
}
async componentWillMount(){
   await this.fetchValues();
   await this.fetchIndexes();
}
async fetchValues()
{
    let values=await axios.get('/api/values/current');
    console.log("data",values.data);
    await this.setState({
        values:values.data
    })
}
async fetchIndexes()
{
  const indexes=await axios.get('/api/values/all');

  await this.setState({
      seenIndexes:indexes.data
  })
}
renderSeenIndexes()
{
    return this.state.seenIndexes.map(({number})=>number).join(',');
}

renderValues()
{
    console.log("values",this.state.values);
    const entries=[];

    for(let key in this.state.values)
    {
        entries.push(
            <div key={key}>
                        For Index {key} i calculated {this.state.values[key]}
            </div>
        )
    }
}

async handleSubmit(){
    // event.preventDefault();

    let data={
        index:this.state.index,
        image:this.state.items.itemstatus.value
    }
    console.log("called");
    await axios.post('/api/values/input',{data});
    await this.setState({
        index:'',
        items:{
            itemstatus:{
                value:''
            }
        }
    })
}
handleChange(event)
{
    let e=event.target.value;
    this.setState({
        index:e
       
    })
}

handleselectedFile = event => {
    console.log(event.target.files[0].name);
    if(event.target.files[0].size < 5263360 && (event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg')){
        // this.setState({
        // selectedFile: event.target.files[0],
        // loaded: 0,
        // img_error:''
        // },()=>{
        //     console.log(this.state)
        // })

        this.setState({
            items:{
                itemstatus:{
                    value:event.target.files[0].name
                }
            }
        })
    }
    else{
        this.setState({
            img_error:"Image should be jpg,jpeg and png and maximum size 5MB"
        })
    }
  }

render(){
    return (
        <div>
                <label>Enter Your Index</label>
                <input type="text" value={this.state.index} onChange={this.handleChange.bind(this)}/>
                <button onClick={this.handleSubmit.bind(this)}>Submit</button>
            <h3>Indexes I have seen</h3>
            {
                this.renderSeenIndexes()
            }
            {/* <h3>Calculated Values:</h3>
            {this.renderValues()} */}

            <div > 
                                {/* <FormGroup validationState={this.state.items.itemstatus.valid ? 'success': 'error'}> */}
                                {/* <ControlLabel> */}
                                    Item image  <span className="text-danger">*</span>
                                {/* </ControlLabel> */}
                                    <input type="file" max-size="5263360"  name="" id="" accept="image/gif, image/jpeg, image/x-png" onChange={this.handleselectedFile}/>
                                    <span style={{color:'red'}}>{this.state.img_error}</span>
                                {/* </FormGroup>  */}
                            </div>
        </div>
    )
}
}

export default Fib;