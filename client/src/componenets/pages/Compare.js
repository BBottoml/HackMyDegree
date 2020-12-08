import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();
const host = "http://35.229.29.153/api"

export class Compare extends Component {

    // constructor(props) {
    //     // super(props)

    //     // this.state = {
    //     //     user_stats: []
    //     // }
    // }

    // componentDidMount() {
    //     console.log("In CDM")
    //     // axios.get(host + '/users/stats')
    //     // .then(response => {
    //     //     this.setState({this.state.user_stats: response.data})
    //     // })

    //     // console.log(user_stats)
    // }
    render() {
        return (<div>
            <h1>Compare</h1>

            <br />
            <br />
            <h3>On compare</h3>
            </div>
            
            
            )
    }

}

export default Compare