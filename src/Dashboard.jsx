import React, { Component } from 'react';
import './Dashboard.css';
import { BASEURL, callApi, getSession, setSession } from './api';
import MenuBar from './MenuBar';
import JobPostings from './JobPostings';
import JobSearch from './JobSearch';
import MyProfile from './MyProfile';

class Dashboard extends Component {
    constructor()
    {
        super();
        this.state = {fullname: "", activeComponent: ""};
        this.fullnameResponse = this.fullnameResponse.bind(this);
        this.loadComponent = this.loadComponent.bind(this);
    }
    componentDidMount()
    {
        let CSR = getSession("csrid");
        if(CSR === "")
            this.logout();

        let data = JSON.stringify({
            csrid : CSR
        });
        callApi("POST", BASEURL + "user/fullname", data, this.fullnameResponse);
    }
    fullnameResponse(response)
    {
        let data = response.split("::");
        if(data[0] === "200")
            this.setState({fullname: data[1]});
        else
            this.logout();
    }
    logout()
    {
        setSession("csrid", "", -1);
        window.location.replace("/");
    }
    loadComponent(mid)
    {
        let components = {
            "1" : <JobPostings/>,
            "2" : <JobSearch/>,
            "3" : <MyProfile/>
        };
        this.setState({activeComponent: components[mid]});
    }
    render() {
        const {fullname, activeComponent} = this.state;
        return (
            <div className='dashboard'>
                <div className='header'>
                    <img src='/logo.png' alt='' className='logo' />
                    <div className='logoText'>Job <span>Portal</span></div>
                    <img src='/logout.png' alt='' className='logout' onClick={()=>this.logout()} />
                    <label className='fullname'>{fullname}</label>
                </div>
                <div className='menu'>
                    <MenuBar onMenuClick={this.loadComponent} />
                </div>
                <div className='outlet'>{activeComponent}</div>
            </div>
        );
    }
}

export default Dashboard;
