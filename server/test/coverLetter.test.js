import request from 'supertest';
import { app } from '../server';
import User from '../models/User';
import jwt from 'jsonwebtoken';

describe('Cover Letter Generation API', () => {
  let token;
  
  beforeEach(async () => {
    // Create a test user and get token
    const user = new User();
    user.username = 'coverletteruser';
    user.email = 'coverletter@example.com';
    user.gender = 'male';
    await user.setPassword('password123');
    await user.save();
    
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret');
  });
  
  test('should generate a cover letter', async () => {
    // Mock the DeepSeek API call in your controller or use a conditional in your code for testing
    
    const res = await request(app)
      .post('/api/users/generate-cover-letter')
      .set('Cookie', [`jwt=${token}`])
      .send({
        resume: 'Experienced software developer with React and Node.js skills',
        jobDescription: 'Looking for a full-stack developer with React experience'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('coverLetter');
    expect(typeof res.body.coverLetter).toBe('string');
    expect(res.body.coverLetter.length).toBeGreaterThan(100);
  });
  
  test('should return error when missing required fields', async () => {
    const res = await request(app)
      .post('/api/users/generate-cover-letter')
      .set('Cookie', [`jwt=${token}`])
      .send({
        resume: 'Experienced software developer'
        // Missing jobDescription
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });
});