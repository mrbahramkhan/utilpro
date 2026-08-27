/**
 * UtilPro — Real PDF Conversion Engine
 * Uses: PDF.js (text/page extraction) + SheetJS (Excel output)
 * All processing is 100% client-side in the browser.
 */

/* ═══════════════════════════════════════════════════
   PDF.js SETUP
   ═══════════════════════════════════════════════════ */
let pdfjsLib = null;

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (pdfjsLib) { resolve(pdfjsLib); return; }
    // Check if already loaded globally
    if (window['pdfjs-dist/build/pdf']) {
      pdfjsLib = window['pdfjs-dist/build/pdf'];
      const base = (() => { const s = document.querySelector('script[src*="pdf-convert"]'); return s ? s.src.replace('js/pdf-convert.js','') : '../'; })();
      pdfjsLib.GlobalWorkerOptions.workerSrc = base + 'libs/pdf.worker.min.js';
      resolve(pdfjsLib); return;
    }
    const script = document.createElement('script');
    const base2 = (() => { const s = document.querySelector('script[src*="pdf-convert"]'); return s ? s.src.replace('js/pdf-convert.js','') : '../'; })();
    script.src = base2 + 'libs/pdf.min.js';
    script.onload = () => {
      pdfjsLib = window['pdfjs-dist/build/pdf'];
      // Point worker to local copy
      // Auto-detect base path for GitHub Pages compatibility
const _base = (() => {
  const scripts = document.querySelectorAll('script[src]');
  for(const s of scripts){
    if(s.src.includes('pdf-convert')) return s.src.replace('js/pdf-convert.js','');
  }
  return window.location.origin + '/';
})();
pdfjsLib.GlobalWorkerOptions.workerSrc = _base + 'libs/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = () => reject(new Error('PDF.js failed to load'));
    document.head.appendChild(script);
  });
}

function loadXlsx() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const script = document.createElement('script');
    const base3 = (() => { const s = document.querySelector('script[src*="pdf-convert"]'); return s ? s.src.replace('js/pdf-convert.js','') : '../'; })();
    script.src = base3 + 'libs/xlsx.full.min.js';
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error('SheetJS failed to load'));
    document.head.appendChild(script);
  });
}

/* ═══════════════════════════════════════════════════
   CORE: READ PDF → structured data
   ═══════════════════════════════════════════════════ */
async function parsePDF(file) {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    // Get all text items with their positions
    const items = textContent.items.map(item => ({
      text: item.str,
      x: Math.round(item.transform[4]),
      y: Math.round(viewport.height - item.transform[5]), // flip Y axis
      w: Math.round(item.width),
      h: Math.round(item.height),
      fontName: item.fontName || '',
    }));

    pages.push({ pageNum: i, items, width: viewport.width, height: viewport.height });
  }
  return { pages, numPages: pdf.numPages };
}

/* ═══════════════════════════════════════════════════
   TABLE DETECTION ALGORITHM
   Groups text items into rows and columns by Y proximity
   ═══════════════════════════════════════════════════ */
function detectTables(items, pageWidth) {
  if (!items.length) return [];

  // Group items into rows by similar Y position (within 4px)
  const rowMap = new Map();
  items.forEach(item => {
    if (!item.text.trim()) return;
    let foundRow = null;
    for (const [rowY] of rowMap) {
      if (Math.abs(item.y - rowY) <= 5) { foundRow = rowY; break; }
    }
    const key = foundRow ?? item.y;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key).push(item);
  });

  // Sort rows by Y
  const sortedRows = [...rowMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([y, cells]) => ({
      y,
      cells: cells.sort((a, b) => a.x - b.x)
    }));

  // Detect column boundaries across all rows
  const colBoundaries = detectColumns(sortedRows, pageWidth);

  // Map each row's items to columns
  const tableRows = sortedRows.map(row => {
    const rowData = new Array(colBoundaries.length).fill('');
    row.cells.forEach(cell => {
      let colIdx = 0;
      for (let i = 0; i < colBoundaries.length; i++) {
        if (cell.x >= colBoundaries[i].start && cell.x < colBoundaries[i].end) {
          colIdx = i; break;
        }
        if (cell.x >= colBoundaries[i].start) colIdx = i;
      }
      rowData[colIdx] = rowData[colIdx] ? rowData[colIdx] + ' ' + cell.text : cell.text;
    });
    return rowData;
  });

  // Filter out rows that are all empty
  const filtered = tableRows.filter(row => row.some(cell => cell.trim()));

  // Try to detect if content looks tabular (multiple non-empty cells per row)
  const tabularRows = filtered.filter(row => row.filter(c => c.trim()).length > 1);
  const textRows   = filtered.filter(row => row.filter(c => c.trim()).length <= 1);

  return { tableRows: tabularRows.length > 0 ? filtered : filtered, colCount: colBoundaries.length };
}

function detectColumns(rows, pageWidth) {
  // Collect all unique X positions
  const xPositions = [];
  rows.forEach(row => row.cells.forEach(c => xPositions.push(c.x)));
  if (!xPositions.length) return [{ start: 0, end: pageWidth }];

  // Sort and deduplicate with gap detection
  const sorted = [...new Set(xPositions)].sort((a, b) => a - b);
  const clusters = [];
  let clusterStart = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i] - prev;
    if (gap > 30) { // 30px gap = new column
      clusters.push({ start: clusterStart, end: sorted[i - 1] + 60 });
      clusterStart = sorted[i];
    }
    prev = sorted[i];
  }
  clusters.push({ start: clusterStart, end: pageWidth });

  return clusters.length > 0 ? clusters : [{ start: 0, end: pageWidth }];
}

/* ═══════════════════════════════════════════════════
   PDF → EXCEL (XLSX) — REAL IMPLEMENTATION
   ═══════════════════════════════════════════════════ */
async function convertPdfToExcel(file, options = {}) {
  const statusEl = options.statusEl;
  const setStatus = msg => { if (statusEl) statusEl.textContent = msg; };

  try {
    setStatus('Loading PDF.js library…');
    const XLSX = await loadXlsx();

    setStatus('Reading PDF file…');
    const { pages, numPages } = await parsePDF(file);

    setStatus(`Extracting content from ${numPages} pages…`);
    const wb = XLSX.utils.book_new();
    const multiSheet = options.multiSheet || false;
    const allRows = [];

    for (let i = 0; i < pages.length; i++) {
      setStatus(`Processing page ${i + 1} of ${numPages}…`);
      const page = pages[i];
      if (!page || !page.items || !page.items.length) continue;
      const { tableRows, colCount } = detectTables(page.items, page.width);

      if (multiSheet) {
        const ws = XLSX.utils.aoa_to_sheet(tableRows.length ? tableRows : [['No extractable content']]);
        // Style header row
        styleExcelSheet(ws, tableRows, XLSX);
        XLSX.utils.book_append_sheet(wb, ws, `Page ${i + 1}`);
      } else {
        if (i === 0) {
          // Add page header separator for single-sheet mode
        } else {
          allRows.push([]); // blank row between pages
          allRows.push([`--- Page ${i + 1} ---`]);
        }
        allRows.push(...tableRows);
      }
    }

    if (!multiSheet) {
      const ws = XLSX.utils.aoa_to_sheet(allRows.length ? allRows : [['No extractable content found']]);
      styleExcelSheet(ws, allRows, XLSX);
      XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
    }

    setStatus('Generating Excel file…');
    if (wb.SheetNames.length === 0) { const ws = XLSX.utils.aoa_to_sheet([['No extractable text found']]); XLSX.utils.book_append_sheet(wb, ws, 'Result'); }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    setStatus('Done!');
    return {
      blob,
      filename: file.name.replace(/\.pdf$/i, '.xlsx'),
      pages: numPages,
      sheets: multiSheet ? numPages : 1,
    };
  } catch (err) {
    console.error('PDF→Excel error:', err);
    throw new Error(`Conversion failed: ${err.message}`);
  }
}

function styleExcelSheet(ws, rows, XLSX) {
  if (!rows.length) return;
  // Set column widths based on content
  const colWidths = [];
  rows.forEach(row => {
    row.forEach((cell, i) => {
      const len = String(cell || '').length;
      if (!colWidths[i] || colWidths[i] < len) colWidths[i] = len;
    });
  });
  ws['!cols'] = colWidths.map(w => ({ wch: Math.min(Math.max(w + 2, 8), 50) }));
}

/* ═══════════════════════════════════════════════════
   PDF → WORD (DOCX) — Pure JS implementation
   Creates a real .docx file using Open XML format
   ═══════════════════════════════════════════════════ */
async function convertPdfToWord(file, options = {}) {
  const statusEl = options.statusEl;
  const setStatus = msg => { if (statusEl) statusEl.textContent = msg; };

  try {
    setStatus('Reading PDF file…');
    const { pages, numPages } = await parsePDF(file);

    setStatus(`Extracting text from ${numPages} pages…`);

    // Build plain text content per page
    const pageTexts = pages.map(page => {
      if (!page || !page.items || !page.items.length) return '(No text found on this page)';
      // Sort items by Y then X for reading order
      const sorted = [...page.items].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
      let text = '', lastY = -1;
      sorted.forEach(item => {
        if (!item.text.trim()) return;
        if (lastY !== -1 && Math.abs(item.y - lastY) > 8) text += '\n';
        else if (lastY !== -1 && Math.abs(item.y - lastY) <= 8) text += ' ';
        text += item.text;
        lastY = item.y;
      });
      return text;
    });

    setStatus('Building DOCX file…');
    const docx = buildDocx(pageTexts, file.name);

    setStatus('Done!');
    return {
      blob: docx,
      filename: file.name.replace(/\.pdf$/i, '.docx'),
      pages: numPages,
    };
  } catch (err) {
    console.error('PDF→Word error:', err);
    throw new Error(`Conversion failed: ${err.message}`);
  }
}

/* Build a minimal but real .docx Open XML file */
function buildDocx(pageTexts, sourceFileName) {
  // Escape XML entities
  const esc = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Build paragraph XML for each line of text
  function textToParagraphs(text, isHeading = false) {
    const lines = text.split('\n').filter(l => l.trim());
    return lines.map(line => {
      const style = isHeading ? 'Heading1' : 'Normal';
      const boldStart = isHeading ? '<w:b/>' : '';
      const fontSize = isHeading ? '<w:sz w:val="28"/><w:szCs w:val="28"/>' : '';
      return `<w:p>
        <w:pPr><w:pStyle w:val="${style}"/></w:pPr>
        <w:r><w:rPr>${boldStart}${fontSize}</w:rPr><w:t xml:space="preserve">${esc(line)}</w:t></w:r>
      </w:p>`;
    }).join('\n');
  }

  // Build all page content
  const bodyContent = pageTexts.map((text, i) => {
    const pageHeader = `<w:p>
      <w:pPr><w:pStyle w:val="Heading2"/><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:color w:val="1a73e8"/></w:rPr>
      <w:t>Page ${i + 1}</w:t></w:r>
    </w:p>`;

    const content = textToParagraphs(text || '(No text found on this page)');
    const pageBreak = i < pageTexts.length - 1
      ? `<w:p><w:r><w:br w:type="page"/></w:r></w:p>` : '';
    return `${i > 0 ? pageHeader : ''}${content}${pageBreak}`;
  }).join('\n');

  // Full document.xml
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="1a73e8"/></w:rPr>
      <w:t>Converted from: ${esc(sourceFileName)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="18"/></w:rPr>
      <w:t>Converted by UtilPro PDF Tools — ${new Date().toLocaleDateString()}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:br w:type="page"/></w:r></w:p>
    ${bodyContent}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  // Styles XML
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="24"/><w:lang w:val="en-US"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/>
    <w:pPr><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1a73e8"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/>
    <w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="333333"/></w:rPr></w:style>
</w:styles>`;

  // Relationships
  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>UtilPro PDF Tools</Application>
</Properties>`;

  const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:creator>UtilPro</dc:creator>
  <dc:description>Converted from PDF by UtilPro</dc:description>
</cp:coreProperties>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="package/2006/metadata/core-properties+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

  // Build .docx ZIP using JSZip-compatible structure (manual ZIP)
  return buildZip({
    '[Content_Types].xml': contentTypesXml,
    '_rels/.rels': rootRelsXml,
    'word/document.xml': documentXml,
    'word/styles.xml': stylesXml,
    'word/_rels/document.xml.rels': relsXml,
    'docProps/app.xml': appXml,
    'docProps/core.xml': coreXml,
  });
}

/* ═══════════════════════════════════════════════════
   MINIMAL ZIP BUILDER (no external dependency)
   Produces a valid ZIP/DOCX file in a Blob
   ═══════════════════════════════════════════════════ */
function buildZip(files) {
  const parts = [];
  const centralDir = [];
  let offset = 0;

  const encoder = new TextEncoder();
  const crc32Table = makeCRC32Table();

  function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeCRC32Table() {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  }

  function uint16LE(n) { return [n & 0xFF, (n >> 8) & 0xFF]; }
  function uint32LE(n) { return [n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF]; }

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const date = new Date();
    const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);

    // Local file header
    const localHeader = new Uint8Array([
      0x50, 0x4B, 0x03, 0x04, // signature
      0x14, 0x00,              // version needed: 2.0
      0x00, 0x00,              // flags
      0x00, 0x00,              // compression: stored
      ...uint16LE(dosTime),
      ...uint16LE(dosDate),
      ...uint32LE(crc),
      ...uint32LE(data.length),
      ...uint32LE(data.length),
      ...uint16LE(nameBytes.length),
      0x00, 0x00,              // extra field length
      ...nameBytes,
    ]);

    parts.push(localHeader);
    parts.push(data);

    // Central directory entry
    centralDir.push(new Uint8Array([
      0x50, 0x4B, 0x01, 0x02, // signature
      0x14, 0x00,              // version made by
      0x14, 0x00,              // version needed
      0x00, 0x00,              // flags
      0x00, 0x00,              // compression: stored
      ...uint16LE(dosTime),
      ...uint16LE(dosDate),
      ...uint32LE(crc),
      ...uint32LE(data.length),
      ...uint32LE(data.length),
      ...uint16LE(nameBytes.length),
      0x00, 0x00,              // extra length
      0x00, 0x00,              // comment length
      0x00, 0x00,              // disk start
      0x00, 0x00,              // internal attrs
      0x00, 0x00, 0x00, 0x00, // external attrs
      ...uint32LE(offset),
      ...nameBytes,
    ]));

    offset += localHeader.length + data.length;
  }

  // End of central directory
  const centralDirBytes = centralDir.map(c => c.length).reduce((a, b) => a + b, 0);
  const eocd = new Uint8Array([
    0x50, 0x4B, 0x05, 0x06, // signature
    0x00, 0x00,              // disk number
    0x00, 0x00,              // disk with CD
    ...uint16LE(centralDir.length),
    ...uint16LE(centralDir.length),
    ...uint32LE(centralDirBytes),
    ...uint32LE(offset),
    0x00, 0x00,              // comment length
  ]);

  const allParts = [...parts, ...centralDir, eocd];
  const totalSize = allParts.reduce((s, p) => s + p.length, 0);
  const combined = new Uint8Array(totalSize);
  let pos = 0;
  for (const part of allParts) { combined.set(part, pos); pos += part.length; }

  return new Blob([combined], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
}

/* ═══════════════════════════════════════════════════
   PDF → IMAGES (real canvas rendering)
   ═══════════════════════════════════════════════════ */
async function convertPdfToImages(file, options = {}) {
  const fmt    = options.format || 'jpeg';
  const dpi    = options.dpi || 150;
  const quality = options.quality || 0.92;
  const statusEl = options.statusEl;
  const previewEl = options.previewEl;
  const setStatus = msg => { if (statusEl) statusEl.textContent = msg; };

  setStatus('Loading PDF.js…');
  const pdfjs = await loadPdfJs();

  setStatus('Reading PDF…');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const scale = dpi / 72;
  const blobs = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  for (let i = 1; i <= pdf.numPages; i++) {
    setStatus(`Rendering page ${i} of ${pdf.numPages}…`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    // White background for JPG
    if (fmt === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise(res => canvas.toBlob(res, `image/${fmt}`, quality));
    blobs.push({ blob, filename: `page_${String(i).padStart(2, '0')}.${fmt === 'jpeg' ? 'jpg' : 'png'}` });

    // Show real preview thumbnail
    if (previewEl) {
      const thumbCanvas = document.createElement('canvas');
      const thumbCtx = thumbCanvas.getContext('2d');
      thumbCanvas.width = 100;
      thumbCanvas.height = Math.round(100 * viewport.height / viewport.width);
      thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
      const img = document.createElement('img');
      img.src = thumbCanvas.toDataURL();
      img.style.cssText = 'width:100%;border-radius:6px;border:1px solid var(--border);display:block';
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px';
      const label = document.createElement('span');
      label.textContent = `Page ${i}`;
      label.style.cssText = 'font-size:11px;color:var(--text-light)';
      div.appendChild(img);
      div.appendChild(label);
      previewEl.appendChild(div);
    }
  }

  setStatus('Creating ZIP archive…');
  const zipBlob = await createImagesZip(blobs);
  setStatus('Done!');

  return {
    blobs,
    zipBlob,
    filename: file.name.replace(/\.pdf$/i, `-pages.zip`),
    pages: pdf.numPages,
  };
}

async function createImagesZip(blobs) {
  // Build a real ZIP with image files
  const parts = [];
  const centralDir = [];
  let offset = 0;
  const crc32Table = makeCRC32TableForZip();

  function makeCRC32TableForZip() {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  }

  function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xFF];
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function u16(n) { return [n & 0xFF, (n >> 8) & 0xFF]; }
  function u32(n) { return [n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF]; }

  for (const { blob, filename } of blobs) {
    const data = new Uint8Array(await blob.arrayBuffer());
    const nameBytes = new TextEncoder().encode(filename);
    const crc = crc32(data);
    const now = new Date();
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);

    const local = new Uint8Array([
      0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u16(dosTime), ...u16(dosDate), ...u32(crc),
      ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), 0x00, 0x00,
      ...nameBytes,
    ]);

    parts.push(local, data);

    centralDir.push(new Uint8Array([
      0x50, 0x4B, 0x01, 0x02, 0x14, 0x00, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u16(dosTime), ...u16(dosDate), ...u32(crc),
      ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u32(offset), ...nameBytes,
    ]));

    offset += local.length + data.length;
  }

  const cdSize = centralDir.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array([
    0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00,
    ...u16(blobs.length), ...u16(blobs.length),
    ...u32(cdSize), ...u32(offset), 0x00, 0x00,
  ]);

  const all = [...parts, ...centralDir, eocd];
  const size = all.reduce((s, p) => s + p.length, 0);
  const buf = new Uint8Array(size);
  let pos = 0;
  for (const p of all) { buf.set(p, pos); pos += p.length; }
  return new Blob([buf], { type: 'application/zip' });
}

/* ═══════════════════════════════════════════════════
   DOWNLOAD HELPER
   ═══════════════════════════════════════════════════ */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}

// Export to global scope
window.PdfConvert = { convertPdfToExcel, convertPdfToWord, convertPdfToImages, downloadBlob, parsePDF };
