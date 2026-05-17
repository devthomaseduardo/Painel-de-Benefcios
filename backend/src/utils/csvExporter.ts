export const jsonToCsv = (items: any[]) => {
  if (items.length === 0) return "";
  
  const replacer = (key: string, value: any) => value === null ? '' : value;
  const header = Object.keys(items[0]);
  
  const csv = [
    header.join(','), // header row
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');

  return csv;
};
