import React, { Component } from 'react'
import axios from 'axios'
import ReactTags from 'react-tag-autocomplete'
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie'
import "./Home.css"

import toggleButton from "../toggleButton";

const cookies = new Cookies();
const host = "http://35.229.29.153/api"


class Home extends Component {
    constructor(props) {
        super(props)
       
        this.state = {

            //NOTE: tags represent course tags, kept as it was
            tags: [],
            courses: null,
            tracks: null,
            trackTags: [],
            /* value from after fall 2019 slider */
            // afterFall2019: true,

          }
    }

    async componentDidMount() {
        axios.get(host + '/courses')
        .then(response => {
            this.setState({courses: response.data})
            console.log(this.state.courses)
        })
        .catch(err => {
            console.log(err)
        })

        axios.get(host + '/tracks')
        .then(response => {
            console.log("INSIDE TRACKS")
            this.setState({tracks: response.data})
            console.log(this.state.tracks)
        })
        .catch(err => {
            console.log(err)
            console.log("INSIDE ERRORS")

        })

        console.log("AFTER TRACKS")

        
    }

    handleClick = () => {
        this.props.history.push("/results")

    }

    onDelete (i) {
        if (this.state.tags.length !== 0) {
            const tag = this.state.tags[i]
            const courses = this.state.courses
            for (var j = 0; j < this.state.courses.length; j++) {
                if (this.state.courses[j]["course_id"] === tag["course_id"]) {
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
                if (this.state.tracks[i]["track_id"] === trackTag["name"]) {
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
      }

    render() {
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
                            onDelete={this.onDelete.bind(this)}
                            onAddition={this.onTrackAddition.bind(this)}
                            placeholder="Add new track..." />
                            <br/>
                    </div> 
                    
                </div>
            )
        }
    }
}

export default Home;