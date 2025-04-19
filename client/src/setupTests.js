// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Better mock for RTK Query
const createFetchResponse = (data) => {
  return {
    ok: true,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
    blob: jest.fn().mockResolvedValue(new Blob()),
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
  };
};

// Mock fetch for tests
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve(createFetchResponse({
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    token: 'fake-token'
  }))
);

// Mock Request and Response objects which are needed for @reduxjs/toolkit
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
    this.body = options.body || null;
    this.mode = options.mode || 'cors';
    this.credentials = options.credentials || 'same-origin';
  }

  clone() {
    return new Request(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
      mode: this.mode,
      credentials: this.credentials
    });
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = init.headers || {};
  }

  json() {
    return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body);
  }

  text() {
    return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body));
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      headers: this.headers
    });
  }
};

// Replace the mock implementation with a simpler approach
// Define a mock store state that can be used by test files
const mockAuthState = {
  userInfo: {
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    token: 'fake-token'
  }
};

// Make it available globally so tests can access it
global.mockAuthState = mockAuthState;

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: (x, y, w, h) => ({
    data: new Array(w * h * 4),
  }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  fillText: () => {},
  createLinearGradient: () => ({
    addColorStop: () => {},
  }),
});
