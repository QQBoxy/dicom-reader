import {
  readDicomTags,
  setPipelinesBaseUrl,
  setPipelineWorkerUrl,
} from '@itk-wasm/dicom';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import dicomTagsJson from '../assets/libraries/dicomTags.json';
const dicomTags: DicomTags = dicomTagsJson;

import Layout from '../components/Layout';

interface DicomTags {
  [Key: string]: {
    name: string;
    keyword: string;
    vr: string;
    vm: string;
  };
}

interface Tag {
  tag: string;
  name: string;
  keyword: string;
  vr: string;
  vm: string;
  content: string;
}

export default function ReadTags() {
  const [rows, setRows] = useState<Tag[]>(Array(10).fill({ title: '', value: '' }));

  const onDrop = useCallback(async (acceptedFiles) => {
    const fileList = acceptedFiles || [];
    const files: File[] = Array.from(fileList);

    setPipelinesBaseUrl(
      new URL(`${import.meta.env.BASE_URL}itk/pipelines`, document.location.origin).href,
    );
    setPipelineWorkerUrl(
      new URL(
        `${import.meta.env.BASE_URL}itk/itk-wasm-pipeline.min.worker.js`,
        document.location.origin,
      ).href,
    );

    const { tags: tagsArr } = await readDicomTags(files[0]);

    const tags = tagsArr.map((item) => {
      const tag = item[0].toUpperCase();
      return {
        tag: tag,
        ...dicomTags[tag],
        content: item[1],
      };
    });

    setRows(tags);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <Layout>
        <Box sx={{ width: '100%', maxWidth: 1000, align: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Read Tags
          </Typography>
          <div
            {...getRootProps()}
            style={{
              width: '500px',
              // width: {
              //   xs: '500px',
              //   md: '100%',
              // },
              paddingBottom: '20px',
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Box
                component="section"
                height={100}
                display="flex"
                alignItems="center"
                sx={{
                  p: 2,
                  border: '1px dashed grey',
                  bgcolor: blue[50],
                }}
              >
                Drop the files here ...
              </Box>
            ) : (
              <Box
                component="section"
                height={100}
                display="flex"
                alignItems="center"
                sx={{
                  p: 2,
                  border: '1px dashed grey',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: blue[50],
                  },
                }}
              >
                <p>Drag and drop some files here, or click to select files</p>
              </Box>
            )}
          </div>
          {rows.length > 0 && (
            <React.Fragment>
              <Typography variant="h4" gutterBottom>
                Tags List
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tag</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Keyword</TableCell>
                      <TableCell>VR</TableCell>
                      <TableCell>VM</TableCell>
                      <TableCell>Content</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.tag}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.keyword}</TableCell>
                        <TableCell>{row.vr}</TableCell>
                        <TableCell>{row.vm}</TableCell>
                        <TableCell>{row.content}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
          )}
        </Box>
      </Layout>
    </React.Fragment>
  );
}
