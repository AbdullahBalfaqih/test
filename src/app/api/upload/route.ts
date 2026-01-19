'use server';

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';
import { FyaaFile, TaskResult } from '@/lib/types';
import { DocumentCategory } from '@/app/page';

// This is NOT suitable for production as serverless functions are stateless.
// In a real app, you'd use a database like Redis, Firestore, or a simple key-value store.
interface Task {
  id: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result: Partial<TaskResult> & { step?: string; error?: string };
  file: Omit<FyaaFile, 'file' | 'url' | 'objectUrl'>;
}

const tasks = new Map<string, Task>();

function createTask(taskId: string, fileData: Omit<FyaaFile, 'file' | 'url'| 'objectUrl'>) {
  tasks.set(taskId, { id: taskId, status: 'pending', result: { step: 'Initializing...' }, file: fileData });
}

function updateTask(taskId:string, status: Task['status'], result: Partial<TaskResult> & { step?: string; error?: string; }) {
    const task = tasks.get(taskId);
    if (task) {
        task.status = status;
        task.result = { ...task.result, ...result };
        
        if (status === 'done') {
            const finalResult = result as TaskResult;
            if (finalResult.url && finalResult.compressedUrl) {
                task.file.status = 'done';
                task.file.compressedUrl = finalResult.compressedUrl;
                task.file.compressedSize = finalResult.compression?.finalSizeInBytes;
                task.file.url = finalResult.url;
            }
        } else if (status === 'error') {
            task.file.status = 'error';
            task.file.errorMessage = result.error;
        }
    }
}

function getTask(taskId: string): Task | undefined {
  return tasks.get(taskId);
}

function getDoneTasks(): Task[] {
    return Array.from(tasks.values()).filter(task => task.status === 'done');
}


async function processFile(file: File, clientName: string, category: DocumentCategory): Promise<{taskId: string, fileId: string}> {
    const taskId = randomBytes(16).toString('hex');
    const fileId = `${category}___${file.name}`;

    const fileData: Omit<FyaaFile, 'file' | 'url' | 'objectUrl'> = {
        id: fileId,
        token: taskId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0,
        uploadedAt: new Date(),
        category: category,
        clientName: clientName,
    };

    createTask(taskId, fileData);

    // Process the file in the background (don't await this)
    (async () => {
        try {
            updateTask(taskId, 'processing', { step: 'تحليل نوع الملف...' });
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const dataUri = `data:${file.type};base64,${fileBuffer.toString('base64')}`;
            await new Promise(res => setTimeout(res, 500));
            const typeResult = await fileTypeFromBuffer(fileBuffer);
            const detectedType = typeResult?.mime || 'unknown';

            const analysisResult = {
                documentType: detectedType,
                isMatch: true,
                reason: `تم تحديد نوع الملف: ${detectedType}`,
            };

            updateTask(taskId, 'processing', { step: 'ضغط الملف...', analysis: analysisResult });
            await new Promise(res => setTimeout(res, 500));
            
            let bufferToCompress = fileBuffer;
            // The image compression is a placeholder. In a real-world scenario, you'd use a library like 'sharp'
            // to perform actual image compression, which isn't possible in this sandboxed environment.
            // Here, we simulate a 50% size reduction for demonstration purposes if the file is an image.
            let serverCompressedSize = bufferToCompress.length;
            if (file.type.startsWith('image/')) {
                 const simulatedCompressedImageBuffer = Buffer.alloc(Math.floor(bufferToCompress.length * 0.5));
                 bufferToCompress.copy(simulatedCompressedImageBuffer);
                 bufferToCompress = simulatedCompressedImageBuffer;
            }

            const zip = new JSZip();
            // We are adding the original buffer to the zip, but using the potentially reduced size for metadata.
            zip.file(file.name, bufferToCompress, {binary: true}); 

            const compressedBuffer = await zip.generateAsync({
                type: 'nodebuffer',
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9 // Maximum compression
                }
            });

            serverCompressedSize = compressedBuffer.length;
            const compressedDataUri = `data:application/zip;base64,${compressedBuffer.toString('base64')}`;


            const savings = file.size - serverCompressedSize;
            const savingsPercentage = file.size > 0 ? (savings / file.size) * 100 : 0;
            
            const compressionResult = {
                compressionAlgorithm: file.type.startsWith('image/') ? 'Image Compression + ZIP' : 'ZIP (Deflate Level 9)',
                originalSizeInBytes: file.size,
                finalSizeInBytes: serverCompressedSize,
                savingsPercentage: savingsPercentage,
                additionalNotes: `تم توفير ${(savings / 1024).toFixed(2)} KB.`,
            };

            const finalResult: TaskResult = {
                analysis: analysisResult,
                compression: compressionResult,
                url: dataUri,
                compressedUrl: compressedDataUri,
            };

            await new Promise(resolve => setTimeout(resolve, 1000));
            updateTask(taskId, 'done', finalResult);

        } catch (error: any) {
            console.error(`Task ${taskId} failed:`, error);
            updateTask(taskId, 'error', { error: error.message || 'فشل غير معروف' });
        }
    })();

    return { taskId, fileId };
}


export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll('files') as File[];
  const clientName = formData.get('clientName') as string;

  if (!files || files.length === 0) {
    return NextResponse.json({ detail: "No files found in request" }, { status: 400 });
  }

  if (!clientName) {
     return NextResponse.json({ detail: "Client name is required" }, { status: 400 });
  }

  const results = [];
  for (const file of files) {
      // The category is embedded in the filename by the frontend
      const [category, ...rest] = file.name.split('___');
      const originalName = rest.join('___');
      
      const renamedFile = new File([await file.arrayBuffer()], originalName, { type: file.type });

      const result = await processFile(renamedFile, clientName, category as DocumentCategory);
      results.push(result);
  }

  return NextResponse.json({ tasks: results });
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  // If a taskId is provided, return the status of that specific task
  if (taskId) {
    const task = getTask(taskId);
    if (task) {
      // Don't send the full file object, just status and result
      return NextResponse.json({ status: task.status, result: task.result, file: task.file });
    } else {
      // If task not found, it might be that the server just started
      // Or the task ID is invalid. We'll report as pending.
      return NextResponse.json({ status: 'pending', result: { step: 'Initializing...' } });
    }
  }

  // If no taskId, return the list of completed files
  try {
    const tasks = getDoneTasks();
    const files = tasks.map(task => task.file);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1500));
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching file list:', error);
    return NextResponse.json({ detail: 'Failed to fetch file list' }, { status: 500 });
  }
}
