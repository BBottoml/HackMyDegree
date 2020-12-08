import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();
const host = "http://35.229.29.153/api"

export class Compare extends Component {

    constructor(props) {
        super(props)

        this.state = {
            users_tracks: []
        }
    }

    componentDidMount() {
        console.log("In CDM")
        axios.get(host + '/users/stats')
        .then(response => {

           // 
        
            // console.log("Resp data")

            // console.log("Data")
            // console.log(response.data)

            // console.log("Length")
            // console.log(response.data.length)
            var usersList = []
            var trackListsList = [] 
            for (var i = 0; i < response.data.length; i++) {
                usersList.push(response.data[i]["name"])

                for (var k = 0; k < response.data[i]["courses"].length; k++) {
                    response.data[i]["courses"][k] = " | " + response.data[i]["courses"][k] + " | ";
               }
                trackListsList.push(response.data[i]["courses"])
            }
            console.log("user list")
            console.log(usersList)
            console.log("track list")
            console.log(trackListsList)

            this.setState({users_tracks: trackListsList})
            // console.log("User stats")
            // console.log(this.state.user_stats)
        })
    }
       
    render() {

        const usersTracksPairs = []

        // var i = 0
        // for (const [index, value] of this.state.user_stats.entries()) {
        //     usersTracksPairs.push(<h3><li key={index}>Random CS Major {index + 1}: {value}</li></h3>)
        // }

        for (var j = 0; j < this.state.users_tracks.length; j++) {
            usersTracksPairs.push(<h3><li key={j}>Anon CS Major {j + 1}: {this.state.users_tracks[j]}</li></h3>)
        }
        return (<div>
            <h1>Compare</h1>


            <br />
            <h3>See how your tracks stack up against your peers!</h3>
                <br/>
                <br/>
                {usersTracksPairs}
            </div>
            

            )
    }

}

export default Compare