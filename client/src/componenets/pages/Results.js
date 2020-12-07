import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();
const host = "http://35.229.29.153/api"

export class Results extends Component {

    constructor(props) {
        super(props)

        this.state = {
            courses: null
        }
    }

    componentDidMount() {
        axios.post(host + '/compute', {"user_id": cookies.get('user_id')})
        .then(response => {
            this.setState({courses: response.data.courses})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        if (this.state.courses == null) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (this.state.courses.length == 0) {
            return(
                <div>
                    <h1>Error!</h1>
                    <hr />
                    <p>Ensure you fill out your courses and desired tracks!</p> 
                </div>
            )
        }

        const items = []

        for (const [index, value] of this.state.courses.entries()) {
            items.push(<h3><li key={index}>{value}</li></h3>)
        }

        return (
            <div>
                <h1>Results</h1>
                <hr />
                <p>We've crunched the numbers...here's a potential courseload to complete your track(s)!</p>
                {items}
            </div>
        )
    }

    handleClick = () => {
        // this.props.history.push(
        //     {pathname: "/results"
        //     data:
        // })
  
    }
}

export default Results
