'use strict'

const React = require('react')
const Buffer = require('safe-buffer').Buffer
const IPFS = require('ipfs')
const Router = require('react-router-dom').BrowserRouter
const Link = require('react-router-dom').Link
const Route = require('react-router-dom').Route

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: null,
      version: null,
      protocol_version: null,
      added_file_hash: null,
      added_file_contents: null
    }
  }
  componentDidMount () {
    const self = this
    let node

    create()

    function create () {
      // Create the IPFS node instance
      node = new IPFS({
        repo: String(Math.random() + Date.now())
      })

      node.on('ready', () => {
        console.log('IPFS node is ready')
        ops()
      })
    }

    function ops () {
      node.id((err, res) => {
        if (err) {
          throw err
        }
        self.setState({
          id: res.id,
          version: res.agentVersion,
          protocol_version: res.protocolVersion
        })
      })

      node.files.add([Buffer.from(stringToUse)], (err, res) => {
        if (err) {
          throw err
        }

        const hash = res[0].hash
        self.setState({added_file_hash: hash})

        node.files.cat(hash, (err, res) => {
          if (err) {
            throw err
          }
          let data = ''
          res.on('data', (d) => {
            data = data + d
          })
          res.on('end', () => {
            self.setState({added_file_contents: data})
          })
        })
      })
    }
  }
  render () {
    const hash = this.state.added_file_hash;
    return (
      <div style={{textAlign: 'center'}}>
        <Router>
          <div>
            <Route exact={true} path="/" render={() => (
              <div>
                <h1>This is what you think</h1>
                <p>Your ID is <strong>{this.state.id}</strong></p>
                <p>Your IPFS version is <strong>{this.state.version}</strong></p>
                <p>Your IPFS protocol version is <strong>{this.state.protocol_version}</strong></p>
                <p>you added this</p>
                <Link to={`/${hash}`}>
                  {hash}
                </Link>
              </div>
            )}/>
            <Route path="/:hash" component={Note}/>
          </div>
        </Router>
      </div>
    )
  }
}

const Note = ({ match }) => (
  <div>
    {match.params.hash}
  </div>
)

module.exports = App
