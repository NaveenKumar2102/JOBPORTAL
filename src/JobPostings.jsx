import React, { Component } from 'react';
import './JobPostings.css';
import { BASEURL, callApi } from './api';

class JobPostings extends Component {
    constructor()
    {
        super();
        this.state = {
            id: '',
            title : '',
            company : '',
            location : '',
            jobtype : '',
            salary : '',
            description : '',
            joblist: []
        };
        
        this.loadInputChange = this.loadInputChange.bind(this);
        this.readResponse = this.readResponse.bind(this);
        this.updateResponse = this.updateResponse.bind(this);
        this.saveResponse = this.saveResponse.bind(this);
    }
    showPopup()
    {
        jppopup.style.display = "block";
    }
    closePopup()
    {
        jppopup.style.display = "none";
        this.setState({
            id:'',
            title : '',
            company: '',
            location : '',
            jobtype : '',
            salary : '',
            description : ''
        });
    }
    saveJob()
    {
        let data = JSON.stringify(this.state);
        if(this.state.id === "")
            callApi("POST", BASEURL + "job/save", data, this.saveResponse);
        else
            callApi("PUT", BASEURL + "job/update", data, this.saveResponse);
    }
    saveResponse(response)
    {
        let data = response.split("::");
        alert(data[1]);
        this.componentDidMount();
    }
    loadInputChange(event)
    {
        this.setState({[event.target.name]: event.target.value});
    }
    componentDidMount()
    {
        callApi("GET", BASEURL + "job/read", "", this.readResponse);
    }
    readResponse(response)
    {
        if(response.includes("404::"))
        {
            alert(response.split("::")[1]);
            return;
        }

        let data = JSON.parse(response);
        this.setState({joblist : data});
    }
    updateData(id)
    {
        callApi("GET", BASEURL + "job/getdata/" + id, "", this.updateResponse);
    }
    updateResponse(response)
    {
        if(response.includes("404::"))
        {
            alert(response.split("::")[1]);
            return;
        }

        let data = JSON.parse(response);
        this.setState({
            id: data.id,
            title: data.title,
            company: data.company,
            location: data.location,
            jobtype: data.jobtype,
            salary: data.salary,
            description: data.description
        });
        this.showPopup();
    }
    deleteData(id)
    {
        let resp = confirm("Click OK to confirm the deletion");
        if(resp === false)
            return;
        
        callApi("DELETE", BASEURL + "job/delete/" + id, "", this.saveResponse);
    }
    render() {
        const {id, title, company, location, jobtype, salary, description} = this.state;
        const {joblist} = this.state;
        return (
            <div className='jpcontainer'>
                <div id="jppopup">
                    <div className='popupwindow'>
                        <div className='popupheader'>
                            <label id='PHL'>Title</label>
                            <span onClick={()=>this.closePopup()}>X</span>
                        </div>
                        <div className='popupcontent'>
                            <label>Job Title*</label>
                            <input type='text' id='T1' name='title' value={title} onChange={(e)=>this.loadInputChange(e)} />

                            <label>Company Name*</label>
                            <input type='text' id='T2' name='company' value={company} onChange={(e)=>this.loadInputChange(e)} />

                            <label>Job Location*</label>
                            <input type='text' id='T3' name='location' value={location} onChange={(e)=>this.loadInputChange(e)} />

                            <label>Job Type*</label>
                            <select id='T4' name='jobtype' value={jobtype} onChange={(e)=>this.loadInputChange(e)} >
                                <option value=""></option>
                                <option value="1">Full-time</option>
                                <option value="2">Part-time</option>
                            </select>

                            <label>Salary Package*</label>
                            <input type='text' id='T5' name='salary' value={salary} onChange={(e)=>this.loadInputChange(e)} />

                            <label>Job Description*</label>
                            <textarea id='T6' rows="5" name='description' value={description} onChange={(e)=>this.loadInputChange(e)} ></textarea>

                            <button onClick={()=>this.saveJob()}>Save</button>
                        </div>
                        <div className='popupfooter'></div>
                    </div>
                </div>
                <div className='header'>All Jobs</div>
                <div className='content'>
                    {joblist.map((data)=>(
                        <div className='result'>
                            <div className='div1'>
                                <label>{data.title}</label>
                                <span>{data.salary}</span>
                                <img src='/delete.png' alt='' onClick={()=>this.deleteData(data.id)} />
                                <img src='/edit.png' alt='' onClick={()=>this.updateData(data.id)} />
                            </div>
                            <div className='div2'>
                                {data.company} | {data.location} | {data.jobtype === "1" ? 'Full-time' : 'Part-time'}
                            </div>
                            <div className='div3'>
                                {data.description}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='footer'>
                    <button onClick={()=>this.showPopup()}>Post a new job</button>
                </div>
            </div>
        );
    }
}

export default JobPostings;
