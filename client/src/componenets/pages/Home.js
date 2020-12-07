import React, { Component } from 'react'
import axios from 'axios'
import ReactTags from 'react-tag-autocomplete'
// import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie'
import "./Home.css"
import Button from 'react-bootstrap/Button';
// import toggleButton from "../toggleButton";
const cookies = new Cookies();
const host = "http://35.229.29.153/api"

class Home extends Component {
  constructor(props) {
      super(props)
   
      this.state = {
          //NOTE: tags represent course tags, kept as it was
          tags: [],
          courses: [],
          tracks: [],
          trackTags: [],
          /* value from after fall 2019 slider */
          // afterFall2019: true,
        }
  }
  //IMPORTANT NOTE: Took out async keyword before componentDidMount()
    componentDidMount() {
      axios.get(host + '/courses')
      .then(response => {
          this.setState({courses: response.data})
      })
      .catch(err => {
          console.log(err)
      })
      axios.get(host + '/tracks')
      .then(response => {
        this.setState({tracks: response.data})
      })
      .catch(err => {
          console.log(err)
      })
  }
  handleSubmitClick = () => {
    /*
    Make AXIOS Post calls for both add courses and add tracks.

    To get user's ID: 
    
    In handleLogin() in Login.js: cookies.get('user_id', res.data.user_id, { path: '/', maxAge: 999999})

    */
    console.log("Start 1")
    console.log("tracks")
    console.log(this.state.trackTags)

    console.log("courses")
    console.log(this.state.tags)

    var chosen_ids = []

    for (var i = 0; i < this.state.tags.length; i++) {
        console.log("here5")
        chosen_ids.push(this.state.tags[i]["id"])
    }
    axios
    .post(host + "/add/courses", {"user_id": cookies.get('user_id'), "courses": chosen_ids}, {headers: {"Access-Control-Allow-Origin": "*"}})
    .then((res) => {
        let resp = res.data.status
        if (resp === "invalid") {
            console.log("INVALID")
        } else {
            console.log("nOT INVALID")
        }
    })
    .catch(err => {
        console.error(err);}
    )


    var chosen_ids = []

    for (var k = 0; k < this.state.trackTags.length; k++) {
        chosen_ids.push(this.state.trackTags[k]["id"])
    }

    axios
    .post(host + "/add/tracks", {"user_id": cookies.get('user_id'), "tracks": chosen_ids}, {headers: {"Access-Control-Allow-Origin": "*"}})
    .then((res) => {
        let resp = res.data.status
        if (resp === "invalid") {
            console.log("INVALID")
        } else {
            console.log("Tracks not invalid")
        }
    })
    .catch(err => {
        console.error(err);}
    )
    
    this.props.history.push(
        {pathname: "/results",
        data: [this.state.tags, this.state.trackTags]
    })

}

//   submitBtnOnClick() {


//   }

//     // this.props.history.push(
//     //     {pathname: "/results",
//     //     data: [this.state.tags, this.state.trackTags]
//     // })
//   }

  onDelete (i) {
      if (this.state.tags.length !== 0) {
          const tag = this.state.tags[i]
          const courses = this.state.courses
          for (var j = 0; j < this.state.courses.length; j++) {
              if (this.state.courses[j]["id"] === tag["id"]) {
                  courses[j]["disabled"] = false
                  this.setState( {courses} )
                  break
              }
          }
      }
      const tags = this.state.tags.slice(0)
      tags.splice(i, 1)
      this.setState({ tags })
  }

  onTrackDeletion(i) {
      if (this.state.trackTags.length !== 0) {
          const trackTag = this.state.trackTags[i]
          const tracks = this.state.tracks
          for (var j = 0; j < this.state.tracks.length; j++) {
              if (this.state.tracks[i]["id"] === trackTag["id"]) {
                  tracks[j]["disabled"] = false
                  this.setState({tracks})
                  break
              }
          }
      }


      const trackTags = this.state.trackTags.slice(0)
      trackTags.splice(i, 1)
      this.setState( {trackTags} )
  }
 
    onAddition (tag) {
      for (var i = 0; i < this.state.courses.length; i++) {
          if (this.state.courses[i]["name"] === tag["name"]) {
              const courses = this.state.courses
              courses[i]["disabled"] = true
              this.setState({ courses })
              break
          }
      }
      const tags = [].concat(this.state.tags, tag)
      this.setState({ tags })
    }
    
    onTrackAddition(trackTag) {
        console.log(trackTag["name"])
      for (var i = 0; i < this.state.tracks.length; i++) {
          if (this.state.tracks[i]["name"] === trackTag["name"]) {
              console.log("HERE 1")
              const tracks = this.state.tracks
              tracks[i]["disabled"] = true
              this.setState( { tracks } )
              break
          }
      }
      const trackTags = [].concat(this.state.trackTags, trackTag)
      this.setState({trackTags})
      console.log(this.state.trackTags)
    }
  render() {
        if (cookies.get("user_id") == null) {
            window.location.href = "/"
        }

      if (this.state.courses == null) {
          return (
              <div>
                  <div className="text-center">
                      <h1>Loading...</h1>
                  </div>
              </div>
          )
      } else {
          return (
              <div className="container2">
                
                  <div className="text-center">
                      <h1>HackMyDegree</h1>
                      <hr />
                      <p>HackMyDegree is a website that enables Purdue CS majors to easily, and efficiently, plan their track requirements. Get started below!</p>
                      <h3>Step (i) Select courses you have already taken</h3>
                      <p>These are courses that can be counted towards a main track requirement or as an elective</p>
                      <ReactTags
                          tags={this.state.tags}
                          suggestions={this.state.courses}
                          onDelete={this.onDelete.bind(this)}
                          onAddition={this.onAddition.bind(this)}    //TODO:CHANGEEE
                          placeholder="Add new course..." />
                      <br />
                      {/* <h3>Step (ii) Select your track timeline</h3>
                      <p>In other words, if you started Fall 2019 or forward, select After Fall 2019 otherwise select before</p> */}
                      {/* Make a slider */}
                      {/* <div class="selection-stage">
                          <button type="button" className="btn btn-outline-warning" onClick={this.handleClick}>Before Fall 2019</button>&nbsp;&nbsp;
                          <button type="button" className="btn btn-outline-warning" onClick={this.handleClick}>After Fall 2019</button>
                     </div>   */}
                      <h3>Step (ii) Select the tracks you wish to complete</h3>
                      <ReactTags
                          tags={this.state.trackTags} // <-- THIS IS ISSUE
                          suggestions={this.state.tracks}
                          onDelete={this.onTrackDeletion.bind(this)}
                          onAddition={this.onTrackAddition.bind(this)}
                          placeholder="Add new track..." />
                          <br/>

                            <Button variant="secondary" size="lg" onClick={this.handleSubmitClick}>
                                Submit
                            </Button>{' '}

                  </div>
                
              </div>
          )
      }
  }
}
export default Home;
 

