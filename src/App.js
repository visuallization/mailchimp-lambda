import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class LambdaDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, msg: null, members: null, email: '', subscriptionMessage: '' };
  }

  handleClick = e => {
    e.preventDefault();

    this.setState({ loading: true });

    fetch('/.netlify/functions/hello')
      .then(response => response.json())
      .then(json => this.setState({ loading: false, msg: json.msg }));
  };

  getMailChimpList = e => {
    e.preventDefault();

    this.setState({ loading: true });

    fetch('/.netlify/functions/mailchimp')
      .then(response => response.json())
      .then(json => { 
        console.log("RESPONSE: ", json);
        this.setState({ loading: false, members: json.members }); 
      });
  };

  subscribeUser = e => {
    e.preventDefault();

    this.setState({ loading: true });
  
    fetch('/.netlify/functions/subscribe', { method: 'POST', body: this.state.email })
    .then(response => {
      console.log(response);
      if(response.ok) {
        return response.json()
      }
      else return null;
    })
    .then(json => { 
      console.log("RESPONSE: ", json);
      this.setState({ 
        loading: false, 
        subscriptionMessage: json ? 
        'Sie wurden erfolgreich zu unserem Newsletter angemeldet' : 
        'Leider ist ein Fehler aufgetreten.' 
      }); 
    });
  }

  setEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  render() {
    const { loading, msg, members, subscriptionMessage } = this.state;

    return (
      <div>
        <button onClick={this.handleClick}>
          {loading ? 'Loading...' : 'Call Lambda'}
        </button>
        <br />
        <p>{msg}</p>
        <button onClick={this.getMailChimpList}>
          Get MailChimp List
        </button>
        <div className="member-list">
          { members ? members.map((member, i) => <div key={i}>{member.email_address}</div>) : null }
        </div>

        <form onSubmit={this.subscribeUser}>
          <input type="email" onChange={this.setEmail} placeholder="your.email@address.com" autoCapitalize="off" autoCorrect="off" size={25} />
          <button type="submit" name="submit">
            Submit
          </button>
        </form>

        <div>
          {subscriptionMessage}
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <LambdaDemo />
        </header>
      </div>
    );
  }
}

export default App;
