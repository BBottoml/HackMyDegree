import React, { Component } from 'react'

export default class About extends Component {






    render() {

        return(

            <div className="container">
                <div className="text-center">
                    <h1>About HackMyDegree</h1>
                    <hr /> 
                    <p>HackMyDegree is a website that enables Purdue Computer Science majors 
                        to efficiently plan their schedule (specifically, their upper level courses) 
                        by assessing a combination of their completed courses and their interests.
                        For instance, if an individual has completed 3 upper-level CS courses and has
                        expressed interest in X and Y tracks, HackMyDegree will provide information
                        on the best way to complete X and Y tracks (namely, the fewest amount of courses 
                        to complete the outlined requirements).
                    </p> <br /> 
                    <p><b>Disclaimer:</b> This program is meant to assist Purdue CS majors in their educational
                    endeavours by providing a free-of-charge service that helps them evaluate their course options. 
                    To this end, HackMyDegree and any affiliated parties hold no responsibility for
                    inaccuracies that may result from the usage of this program.</p>




                </div>

            </div>
            


        )

    }

}