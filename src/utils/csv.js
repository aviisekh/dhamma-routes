export function parseCSV(text) {
    const result = [];
    let row = [''];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i+1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                row[row.length - 1] += '"';
                i++; // Skip next double quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push('');
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') { i++; }
            result.push(row);
            row = [''];
        } else {
            row[row.length - 1] += char;
        }
    }
    
    if (row.length > 1 || row[0] !== '') {
        result.push(row);
    }
    
    const headers = result[0].map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < result.length; i++) {
        const rowData = result[i];
        if (rowData.length < headers.length) continue;
        
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = rowData[j] ? rowData[j].trim() : '';
        }
        data.push(obj);
    }
    
    return data;
}
