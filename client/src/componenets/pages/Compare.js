import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();
const host = "http://35.229.29.153/api"

export class Compare extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user_stats: []
        }
    }

    componentDidMount() {
        console.log("In CDM")
        axios.get(host + '/users/stats')
        .then(response => {

            this.setState({user_stats: response.data})
        
            // console.log("Resp data")

            // var usersList = []
            // var trackListsList = [] 
            // console.log("Data")
            // console.log(response.data)

            // console.log("Length")
            // console.log(response.data.length)
            // for (var i = 0; i < response.data.length; i++) {
                
            // }
          
            // console.log("User stats")
            // console.log(this.state.user_stats)
        })
    }
       
    render() {

        const usersTracksPairs = []

        // var i = 0
        for (const [index, value] of this.state.user_stats.entries()) {
            usersTracksPairs.push(<h3><li key={index}>Random CS Major {index + 1}: {value}</li></h3>)
        }
        return (<div>
            <h1>Compare</h1>

            <br />
            <br />
            <h3>See how your tracks stack up against your peers!</h3>
                {usersTracksPairs}
            </div>
            
            )
    }

}

export default Compare