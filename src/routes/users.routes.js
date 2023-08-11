//Module imports
import { Router } from 'express';

const router = Router();

//File imports
import { validateRole } from '../middlewares/validations.js';
import { toggleRole, getUsers } from '../dao/controllers/user.controller.js';

router.put('/premium/:uid', validateRole(['admin']), toggleRole);

router.get('/', validateRole(['admin']), getUsers);

export default router;