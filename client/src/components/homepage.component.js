import React, { Component } from 'react'
//import axios from 'axios'
import ReactTags from 'react-tag-autocomplete'
import './homepage.css'


export default class HomePage extends Component {
    constructor(props) {
        super(props) 
    
        /* Insert AXIOS get request to MongoDB to auto populate suggestions */ 
        this.state = {
            tags: [],
            suggestions: [
              { id: 3, name: "CS490D0: Distributed Systems" },
              { id: 4, name: "Mangos" },
              { id: 5, name: "Lemons" },
              { id: 6, name: "Apricots" }
            ]
          }

    }

    handleDelete (i) {
        if (this.state.tags.length !== 0) {
            const tag = this.state.tags[i]
            const suggestions = this.state.suggestions
            for (var j = 0; j < this.state.suggestions.length; j++) {
                if (this.state.suggestions[j]["id"] === tag["id"]) {
                    suggestions[j]["disabled"] = false
                    this.setState( {suggestions} )
                    break
                }
            }
        }
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
    }
     
      handleAddition (tag) {
        for (var i = 0; i < this.state.suggestions.length; i++) {
            if (this.state.suggestions[i]["name"] === tag["name"]) {
                const suggestions = this.state.suggestions
                suggestions[i]["disabled"] = true
                this.setState({ suggestions })
                break
            }
        }
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
      }

    render() {

        return(

            <div className="container">
                <div className="text-center">
                    <h1>HackMyDegree</h1> 
                    <hr /> 
                    <p>HackMyDegree is a website that enables Purdue CS majors to easily, and efficiently, plan their track requirements. Get started below!</p>
                    <h3>Step (i) Select courses you have already taken</h3>
                    <p>These are courses that can be counted towards a main track requirement or as an elective</p>
                    <ReactTags
                        tags={this.state.tags}
                        suggestions={this.state.suggestions}
                        handleDelete={this.handleDelete.bind(this)}
                        handleAddition={this.handleAddition.bind(this)}
                        placeholder="Add new course..." />
                    <br />
                    <h3>Step (ii) Select your track timeline</h3> 
                    <p>In other words, if you started Fall 2019 or forward, select After Fall 2019 otherwise select before</p>
                    <div class="selection-stage">
                        <button type="button" className="btn btn-outline-warning">Before Fall 2019</button>&nbsp;&nbsp;
                        <button type="button" className="btn btn-outline-warning">After Fall 2019</button>
                    </div>
                </div>    
            </div>

        )
    }
}