import multer from 'multer'
import { MIMES_AUTORISES } from '../config/storage'
import { HttpError } from '../utils/errors'

export const uploadScan = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (MIMES_AUTORISES.includes(file.mimetype)) return cb(null, true)
    cb(new HttpError(415, 'Formats acceptés : PDF, JPEG, PNG'))
  },
}).single('scan')
