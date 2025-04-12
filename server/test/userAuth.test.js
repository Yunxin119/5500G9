import request from 'supertest';
import { app } from '../server';
import User from '../models/User';

describe('User Authentication API', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('token');
  });

  test('should login existing user', async () => {
    // First create a user
    const user = new User();
    user.username = 'loginuser';
    user.email = 'login@example.com';
    user.gender = 'female';
    await user.setPassword('password123');
    await user.save();

    // Try to login
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'loginuser');
    expect(res.body).toHaveProperty('token');
  });
});