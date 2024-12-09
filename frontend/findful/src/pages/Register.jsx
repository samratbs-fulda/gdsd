import React from 'react';
import { Form, Input, Button, message, Select, Layout } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { registerUser } from '../services/login/loginService';

const { Option } = Select;
const Register = () => {
  const onFinish = async (values) => {
    try {
      await registerUser(values);
      message.success('Registration successful! Please log in.');
      // window.location.href = '/';
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
          { min: 6, message: 'Password must be at least 6 characters long!' },
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
        name="name"
        rules={[
          { required: true, message: 'Please enter your name!' },
          { min: 1, message: 'Please enter a valid name!' },
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
        ]}
      >
        <Input
          placeholder="Lastname"
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
            <Option value='student'>Student</Option>
            <Option value='landlord'>Landlord</Option>
            <Option value='admin'>Admin</Option>
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
