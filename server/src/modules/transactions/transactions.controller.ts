import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('upload-json')
  @UseInterceptors(FileInterceptor('json'))
  uploadTransactionJsonData(@UploadedFile() file) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    if (file.mimetype !== 'application/json') {
      throw new Error('Uploaded file must be a JSON file');
    }

    try {
      const jsonData = JSON.parse(file.buffer.toString());
      // Now jsonData holds the parsed JSON data from the uploaded file
      // You can pass jsonData to your service for further processing
      const response = this.transactionsService.jsonInputHandler(jsonData);

        return {
        message: 'File uploaded and JSON data processed successfully',
        data: response, 
      };
    } catch (error) {
      throw new Error('Failed to process uploaded JSON file');
    }
  }
}
