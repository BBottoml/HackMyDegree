import React, { Component } from 'react'
import axios from 'axios'
import ReactTags from 'react-tag-autocomplete'
import { useHistory } from 'react-router-dom';
import "./Home.css"

import toggleButton from "../toggleButton";



class Home extends Component {
    constructor(props) {
        super(props)
       
        this.state = {
            tags: [],

            /* Everything is the same as the schema except name, which represents course_name*/
            courses: [
              { course_id: 3, name: "Distributed Systems"},
              { course_id: 4, name: "Mangos" },
              { course_id: 5, name: "Lemons" },
              { course_id: 6, name: "Apricots" }
            ],

            /* value from after fall 2019 slider */
            afterFall2019: true,

          }
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


    render() {
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
                        onAddition={this.onAddition.bind(this)}
                        placeholder="Add new course..." />
                    <br />
                    <h3>Step (ii) Select your track timeline</h3> 
                    <p>In other words, if you started Fall 2019 or forward, select After Fall 2019 otherwise select before</p>

                    {/* Make a slider */}
                    <div class="selection-stage">
                        <button type="button" className="btn btn-outline-warning" onClick={this.handleClick}>Before Fall 2019</button>&nbsp;&nbsp;
                        <button type="button" className="btn btn-outline-warning" onClick={this.handleClick}>After Fall 2019</button>
                    </div>

                   


                </div> 
                
            </div>
        )
    }
}

export default Home;