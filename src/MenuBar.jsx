import React, { Component } from 'react';
import './MenuBar.css';
import { BASEURL, callApi, getSession } from './api';

class MenuBar extends Component {
    constructor()
    {
        super();
        this.state = {menuList:[]};
        this.loadMenus = this.loadMenus.bind(this);
    }
    componentDidMount()
    {
        let CSR = getSession("csrid");
        let data = JSON.stringify({
            csrid : CSR
        });
        callApi("POST", BASEURL + "menus/getmenusbyrole", data, this.loadMenus);
        //callApi("POST", BASEURL + "menus/getmenus", "", this.loadMenus);
    }
    loadMenus(response)
    {
        let data = JSON.parse(response);
        this.setState({menuList: data});
    }
    render() {
        const {menuList} = this.state;
        return (
            <div className='menubar'>
                <div className='menuHeader'><img src='/menu.png' alt=''/> MENU</div>
                <div className='menuList'>
                    <ul>
                        {menuList.map((row)=>(
                            <li onClick={()=>this.props.onMenuClick(row.mid)} ><img src={row.micon} alt='' /> {row.mtitle} </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default MenuBar;
