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

   async componentDidMount() {
        console.log("In CDM")
        axios.get(host + '/users/stats')
        .then(response => {
            // console.log("Resp data")
            // console.log(response.data)
            this.setState({user_stats: response.data})
            console.log("User stats")
            console.log(this.state.user_stats)
        })

        
       
    }
    render() {
        return (<div>
            <h1>Compare</h1>

            <br />
            <br />
            <h3>Here's what other CS majors are doing!</h3>
            </div>
            
            )
    }

}

export default Compare