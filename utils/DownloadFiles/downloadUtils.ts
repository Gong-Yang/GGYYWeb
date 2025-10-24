// utils/downloadUtils.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface DownloadableFile {
  url: string; // 文件下载链接
  name: string; // 文件名
  type?: string;  // 文件类型
}

export interface DownloadOptions {
  zipName?: string; // zip 文件名
  onProgress?: (progress: number, currentFile?: string) => void; // 进度回调
  onError?: (error: Error, file?: DownloadableFile) => void; // 错误回调
}


const errerMessage = '文件下载失败，请重试'; //错误提示

/*
    如需调用，请移步 useDownload.ts 文件。在该文件中 调用下面方法，定义hooks，暴露给外部使用
*/


/**
 * 下载多或单个文件，支持进度回调
 */
export async function downloadFilesWithProgress(
  files: DownloadableFile[] | DownloadableFile,
  options: DownloadOptions = {}
): Promise<void> {
  const fileList = Array.isArray(files) ? files : [files];
  const { zipName, onProgress, onError } = options;

  if (fileList.length === 0) {
    alert('没有文件可下载');
    throw new Error('No files to download');
  }

  // 单个文件直接下载
  if (fileList.length === 1) {
    downloadFile(fileList[0]!); //!断言 fileList[0] 存在
    return;
  }

  // 多个文件带进度下载
  await downloadFiles(fileList, { zipName, onProgress, onError });
}



/**
 * 下载单个文件
 */
export function downloadFile(file: DownloadableFile): void {
  if(file.url === '' || file.url === null){
    alert(errerMessage);
    throw new Error('Invalid file URL');
  }

  const a = document.createElement('a');
  a.href = file.url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 下载多个文件
 */
export async function downloadFiles(
  files: DownloadableFile[],
  options: DownloadOptions
): Promise<void> {
  const { zipName, onProgress, onError } = options;
  const zip = new JSZip();
  let completed = 0;

  try {
    // 串行下载以便跟踪进度
    for (const file of files) {
      try {
        onProgress?.(completed / files.length * 100, `Downloading ${file.name}`);
        
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const blob = await response.blob();
        zip.file(file.name, blob);
        
        completed++;
        onProgress?.(completed / files.length * 100, file.name);
      } catch (error) {
        alert(file.name + errerMessage);
        onError?.(error as Error, file);
        throw error;
      }
    }

    // 生成 ZIP
    onProgress?.(100, 'Creating ZIP file');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    const fileName = zipName ? `${zipName}.zip` : `downloads-${Date.now()}.zip`;
    saveAs(zipBlob, fileName);
    
  } catch (error) {
    alert(errerMessage);
    console.error('Download failed:', error);
    throw error;
  }
}