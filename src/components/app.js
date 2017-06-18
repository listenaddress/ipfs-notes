'use strict'

const React = require('react')
const Buffer = require('safe-buffer').Buffer
const IPFS = require('ipfs')
const Router = require('react-router-dom').BrowserRouter
const Link = require('react-router-dom').Link
const Route = require('react-router-dom').Route
const withRouter = require('react-router-dom').withRouter
let node

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { note: '' }
  }

  handleChange = this.handleChange.bind(this)
  saveNote = this.saveNote.bind(this)

  handleChange (event) {
    this.setState({ note: event.target.value });
  }

  // Save note and navigate to /:hash
  saveNote (history) {
    const self = this
    node.files.add([Buffer.from(this.state.note)], (err, res) => {
      if (err) {
        throw err
      }

      self.setState({ note: '' })
      history.push(res[0].hash)
    })
  }

  getNote (hash) {
    const self = this

    return new Promise(resolve => {
      const interval = setInterval(function () {
        if (node && node.files && node._repo && node._repo.blockstore) {
          fetch()
          clearInterval(interval)
        }
      }, 500);

      function fetch () {
        node.files.cat(hash, (err, res) => {
          if (err) {
            throw err
          }

          let data = ''
          res.on('data', (d) => {
            data = data + d
            resolve(data)
          })
        })
      }
    });
  }

  componentDidMount () {
    const self = this
    create()

    function create () {
      // Create the IPFS node instance
      node = new IPFS({
        repo: String(Math.random() + Date.now())
      })

      node.on('ready', () => {
        console.log('IPFS node is ready')
      })
    }
  }

  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <Router>
          <div>
            <Route exact={true} path="/" render={(props) => (
              <div>
                <h2>Write you a note</h2>
                <textarea value={this.state.note} onChange={this.handleChange}></textarea>
                <button onClick={() => this.saveNote(props.history)}>save</button>
              </div>
            )}/>
            <Route path="/:hash" render={({match}) => (
              <Note getNote={this.getNote} hash={match.params.hash} />
            )}/>
          </div>
        </Router>
      </div>
    )
  }
}

class Note extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const self = this
    this.props.getNote(this.props.hash).then(note => {
      this.setState({note})
    })
  }

  render () {
    return (
      <div>note —> {this.state.note}</div>
    )
  }
}

module.exports = App
