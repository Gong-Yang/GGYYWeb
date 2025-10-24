// hooks/useDownload.ts
import { useCallback } from 'react';
import { downloadFiles,downloadFile, downloadFilesWithProgress, DownloadableFile, DownloadOptions } from './downloadUtils';

/*
    类型定义、具体实现在 downloadUtils.ts 文件中

    使用示例： 
    const { download } = useDownload();
    await download(files);
*/

export function useDownload() {
  // 批量下载 ,打包成zip
  const downloads = useCallback(async (files: DownloadableFile[], options: DownloadOptions) => {
    return downloadFiles(files, options);
  }, []);

  // 单个下载
  const download = useCallback(async (files: DownloadableFile) => {
    return downloadFile(files);
  }, []);

  // 单个、批量下载，自动判断，带进度
  const downloadWithProgress = useCallback(async (files: DownloadableFile[] | DownloadableFile, options?: DownloadOptions) => {
    return downloadFilesWithProgress(files, options);
  }, []);

  return {
    download,
    downloads,
    downloadWithProgress,
  };
}