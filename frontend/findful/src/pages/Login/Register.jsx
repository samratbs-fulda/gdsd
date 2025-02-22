import React from 'react';
import { Form, Input, Button, message, Select, Layout } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { registerUser } from '../../services/login/loginService';
import { useNavigate } from 'react-router-dom'; 

const { Option } = Select;
const Register = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await registerUser(values);
      message.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Layout style={{ height: '100hv', width: '100wv'}}>
        <Layout.Content style={{ padding: '50px', height: '80%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'Center' }}>
        <Form
      name="register_form"
      className="register-form"
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
          prefix={<MailOutlined />}
          placeholder="Email"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please enter your password!' },
          { min: 12, message: 'Password must be at least 12 characters long!' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])(?=.*\W).*$/, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!' },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords do not match!')
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item
        name="firstname"
        rules={[
          { required: true, message: 'Please enter your name!' },
          { min: 1, message: 'Please enter a valid name!' },
          { pattern: /^[a-zA-Z]*$/, message: 'Name can only contain alphanumeric characters!' },
        ]}
      >
        <Input
          placeholder="Name"
          type="text"
        />
      </Form.Item>

      <Form.Item
        name="lastname"
        rules={[
          { required: true, message: 'Please enter your lastname!' },
          { min: 1, message: 'Please enter a valid lastname!' },
          { pattern: /^[a-zA-Z]*$/, message: 'Lastname can only contain alphanumeric characters!' },
        ]}
      >
        <Input
          placeholder="Lastname"
          type="text"
        />
      </Form.Item>

      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please enter a username!' },
          { min: 1, message: 'Please enter a valid username!' },
          { pattern: /^[a-zA-Z0-9]*$/, message: 'Username can only contain alphanumeric characters!' },
        ]}
      >
        <Input
          placeholder="Username"
          type="text"
        />
      </Form.Item>

      <Form.Item
      name="role"
      rules={[
        {
          required: true,
        },
      ]}>
        <Select
        placeholder='What type of user are you?'
        allowClear>
            <Option value='STUDENT'>Student</Option>
            <Option value='LANDLORD'>Landlord</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="register-form-button"
          block
        >
          Register
        </Button>
        Already have an account? <a href="/login">Log in!</a>
      </Form.Item>
    </Form>
        </Layout.Content>
    </Layout>
  );
};

export default Register;
