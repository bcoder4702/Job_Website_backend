import { Router } from 'express';
import health from '../controllers/health';

const router = Router();

router.get('/', health.checkHealth);

export default router;
