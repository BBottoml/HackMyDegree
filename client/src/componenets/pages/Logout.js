import React, { Component } from 'react'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class Logout extends Component {
    render() {
        cookies.remove('user_id', { path: '/' });
        window.location.href = "/"
        return (
            <div>
                <h1>Results</h1>
            </div>
        )
    }

}

export default Logout
