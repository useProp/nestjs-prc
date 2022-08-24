import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  public async createFile(file): Promise<string> {
    try {
      console.log(file)
      const fileName = `${uuid.v4()}.jpg`;
      const filePath = path.join(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      console.log(e)
      throw new HttpException(
        'Server error: File creating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
