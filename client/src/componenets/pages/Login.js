import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import "./About.css"

const cookies = new Cookies()
const host = "http://35.229.29.153/api"


export default class About extends Component {

    constructor(props) {
        super(props)
        this.state = { email: '',  password: ''}
        this.handleEmail = this.handleEmail.bind(this)
        this.handlePass = this.handlePass.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)

    }

    handleEmail(event) {
        this.setState({ email: event.target.value })
    }

    handlePass(event) {
        this.setState({ password: event.target.value })
    }

    handleLogin(event) {
        axios
        .post(host + '/login', {"email": this.state.email, "pswd": this.state.password})
        .then((res) => {
            let resp = res.data.status
            if (resp === "invalid") {
                alert("Email or password is incorrect.")
            } else {
                cookies.set('user_id', res.data.user_id, { path: '/', maxAge: 999999})
                window.location.href = "http://localhost:3000/home"

            }   
        })
        .catch(err => {
            console.error(err);
        }); 
        event.preventDefault()
    }

    handleRegister(event) {
        axios
            .post(host + '/register', {"email": this.state.email, "pswd": this.state.password})
            .then((res) => {
                let resp = res.data.status
                if (resp === "invalid") {
                    alert("Something went wrong. This usually means the user already exists.")
                } else {
                    alert("You have successfully registered. You may now log in.")
                }
            })
            .catch(err => {
                console.error(err);
        }); 
        event.preventDefault()
    }
    

    render() {

        return(

            <div className="container3">
                <div className="text-center">
                    <h1>Login/Register</h1>
                    <hr /> 
                    <p>Login or Register for a Hack My Degree account below.
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <p>Email:</p>
                        <input
                        type="email"
                        value={this.state.email}
                        onChange={this.handleEmail}
                        /> <br />
                        <p>Password:</p>
                        <input 
                        type="password"
                        value={this.state.password}
                        onChange={this.handlePass}
                        /> <br /> <br /> 
                        <input type="submit" value="Login" onClick={this.handleLogin} /> | <input type="submit" value="Register" onClick={this.handleRegister}/>
                    </form>



                </div>

            </div>
            


        )

    }

}