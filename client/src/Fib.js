import React,{Component} from 'react';
import axios  from 'axios';

class Fib extends Component{
constructor(props)
{
    super(props);

    this.state={

        seenIndexes:[],
        values:{},
        index:''

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
    await axios.post('/api/values/input',{index:this.state.index});
    await this.setState({
        index:''
    })
}
handleChange(event)
{
    let e=event.target.value;
    this.setState({
        index:e
    })
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
        </div>
    )
}
}

export default Fib;