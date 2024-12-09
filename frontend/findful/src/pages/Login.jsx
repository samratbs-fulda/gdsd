import React from 'react';
import { Form, Input, Button, Checkbox, message, Layout } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginUser, authUser } from '../services/login/loginService';

const Login = () => {
  const onFinish = async (values) => {
    try {
        const response = await loginUser(values);
        const data = await response.json();
        try{
          if (response.status !== 200) throw Error('Authentication failed!');
          console.log('Login response:', data);
          await authUser(response);
          message.success('Login successful!');
          // window.location.href = '/';
        } catch(error){
          console.error('Login error:', error);
          message.error(error.message || 'Login failed!');
        }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Layout style={{ height: '100hv', width: '100wv'}}>
        <Layout.Content style={{ padding: '50px', height: '80%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'Center' }}>
        <Form
      name="login_form"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ minWidth: 290, margin: 'auto', marginTop: '50px' }}
    >
      <Form.Item
        name="email"
        rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgot-password">
          Forgot password?
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
        >
          Log in
        </Button>
        Or <a href="/register">register now!</a>
      </Form.Item>
    </Form>
        </Layout.Content>
    </Layout>
  );
};

export default Login;
