import { promises as fsPromises } from 'fs';
import { HTMLElement, parse } from 'node-html-parser';

interface DicomTag {
  name: string;
  keyword: string;
  vr: string;
  vm: string;
}

interface DicomTags {
  [Key: string]: DicomTag;
}

const DICOM_CHAPTER_6 =
  'https://dicom.nema.org/medical/dicom/current/output/chtml/part06/chapter_6.html';
const DICOM_TAGS_JSON_PATH = './src/assets/libraries/dicomTags.json';

function getText(element: HTMLElement) {
  let str = element.querySelector('span')?.text ?? '';
  if (str === '') {
    str = element.querySelector('p')?.text ?? '';
  }
  str = str.replace('\n', '');
  str = str.trim();
  return str;
}

async function main() {
  const res = await fetch(DICOM_CHAPTER_6);
  const text = await res.text();
  const root = parse(text);
  const tableDiv = root.querySelector('.table');
  const table = tableDiv?.querySelector('table');
  const tbody = table?.querySelector('tbody');
  const trList = tbody?.querySelectorAll('tr') ?? [];
  const dicomTagsJson: DicomTags = {};
  for (const tr of trList) {
    const tdList = tr.querySelectorAll('td');
    const oringKey = getText(tdList[0]).toUpperCase();
    const name = getText(tdList[1]);
    const keyword = getText(tdList[2]);
    const vr = getText(tdList[3]);
    const vm = getText(tdList[4]);
    const match = oringKey.match(/\(([^(,]+),([^,)]+)\)/);
    if (match) {
      const key = `${match[1]}|${match[2]}`;
      const dicomTag: DicomTag = { name, keyword, vr, vm };
      dicomTagsJson[key] = dicomTag;
    }
  }
  await fsPromises.writeFile(
    DICOM_TAGS_JSON_PATH,
    JSON.stringify(dicomTagsJson, null, 2),
  );
}

main();
