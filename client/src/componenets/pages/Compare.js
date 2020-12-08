import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();
const host = "http://35.229.29.153/api"

export class Compare extends Component {

    constructor(props) {
        super(props)

        this.state = {
            arr: []
        }
    }

    render() {
        return (<div><h1>Compare</h1></div>)
    }

}
    export default Compare