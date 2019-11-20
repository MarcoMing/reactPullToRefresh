import React from 'react';
import ReactDOM from 'react-dom';
import ReactPullToRefresh from '../src';

class App extends React.Component{

  constructor(){
    super();

    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh(resolve,reject){
    setTimeout(()=>{
      resolve()
    },5000)
  }

  render(){
    return (
      <>
        <ReactPullToRefresh
            onRefresh={this.onRefresh.bind(this)}
            className="my-pull-to-refresh"
            style={{
              textAlign: 'center'
            }}
          >
          <h2 style={{margin: 0}}>Pull down to refresh</h2>
          <ul>
              <li>11</li>
              <li>22</li>
              <li>33</li>
              <li>44</li>
          </ul>
        </ReactPullToRefresh>
      </>
    )
  }
}

ReactDOM.render(<App />,document.querySelector('#app'));
