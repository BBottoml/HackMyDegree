import React, { Component } from 'react'
import "./toggleButton.css"

class toggleButton extends Component {
    render() {
        return (
            <div>
                <label class="switch">
                    <input type="checkbox"/>
                    <span class="slider"></span>
                </label>
            </div>
        )
    }
}

export default toggleButton;
