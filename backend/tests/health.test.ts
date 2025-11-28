import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import healthRoutes from '../src/routes/health';

const app = express();
app.use(express.json());
app.use('/health', healthRoutes);

describe('Health Routes', () => {
  it('GET /health should return status ok with timestamp', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.timestamp).toBeDefined();
    expect(typeof response.body.timestamp).toBe('string');
    
    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });
});
