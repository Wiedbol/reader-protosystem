// Login.js
import React, { Component } from 'react';
import { LoginProps, LoginState } from './interface';
import './login.css';
import userIcon from '../../assets/user-icon.png'
import lockIcon from '../../assets/lock-icon.png'

class Login extends Component<LoginProps & { history: any }, LoginState> {
    constructor(props: LoginProps & { history: any }) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<LoginState, keyof LoginState>);
    };

    handleCheckboxChange = () => {
        this.setState((prevState) => ({ isAdmin: !prevState.isAdmin }));
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password, isAdmin } = this.state;
        const { history } = this.props;

        // 假设在这里验证用户名和密码
        if (username === 'admin' && password === 'adminPass' && isAdmin) {
            // 跳转到管理员界面
            this.props.handleAdmin(true);
            history.push('/manager/home');
        } else if (username === 'user' && password === 'userPass' && !isAdmin) {
            // 跳转到用户界面
            this.props.handleAdmin(false);
            history.push('/manager/home');
        } else {
            alert('登录失败，请检查用户名和密码。');
        }
    };

    render() {
        const { username, password, isAdmin } = this.state;

        return (
            <div className='login-page' style={{backgroundImage: `url(${require('../../assets/login.jpg')})`,

                width: "110vw", left: "100px" ,
                height: "100vh", top: "100px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}>
            <div className='login-container'>
                <h2>欢迎登录</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className='input-group'>
                        <label>
                            <img src={userIcon} alt="用户图标" className='icon'/>
                            用户名：
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={this.handleInputChange}
                                required
                                />
                        </label>
                    </div>
                    <div className='input-group'>
                        <label>
                            <img src={lockIcon} alt="密码" className='icon' />
                            密码：
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                required
                                />
                        </label>
                    </div>
                    <div className='radio-group'>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={this.handleCheckboxChange}
                                />
                            以管理员身份登录
                        </label>
                    </div>
                    <button type="submit">登录</button>
                </form>
            </div>
            </div>
        );
    }
}

// 使用 withRouter 将 history 作为 props 传给 Login 组件
export default Login; 
