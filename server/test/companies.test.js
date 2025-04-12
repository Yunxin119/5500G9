import request from 'supertest';
import { app } from '../server';
import User from '../models/User';
import Company from '../models/Company';
import jwt from 'jsonwebtoken';

describe('Company Management API', () => {
  let token;
  let userId;
  
  beforeEach(async () => {
    // Create a test user and get token
    const user = new User();
    user.username = 'companyuser';
    user.email = 'company@example.com';
    user.gender = 'female';
    await user.setPassword('password123');
    await user.save();
    
    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret');
  });
  
  test('should add a new company application', async () => {
    const res = await request(app)
      .post('/api/companies/add')
      .set('Cookie', [`jwt=${token}`])
      .send({
        name: 'Test Company',
        role: 'Software Engineer',
        city: 'San Francisco, CA',
        link: 'https://example.com/job',
        applyDate: '9/15/2024',
        status: 'Submitted'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Company');
    expect(res.body).toHaveProperty('role', 'Software Engineer');
    
    // Verify the company was added to the user's applications
    const updatedUser = await User.findById(userId);
    expect(updatedUser.applications.length).toEqual(1);
  });
  
  test('should retrieve user applications', async () => {
    // First add a company
    const company = new Company({
      name: 'Retrieval Test Corp',
      role: 'Frontend Developer',
      city: 'Remote',
      link: 'https://example.com/job2',
      applyDate: '9/16/2024',
      status: 'OA',
      user_id: userId
    });
    await company.save();
    
    const user = await User.findById(userId);
    user.applications.push(company._id);
    await user.save();
    
    // Now retrieve it
    const res = await request(app)
      .get('/api/companies')
      .set('Cookie', [`jwt=${token}`]);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('name', 'Retrieval Test Corp');
  });
});