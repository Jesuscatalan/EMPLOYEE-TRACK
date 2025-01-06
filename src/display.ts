import figlet from 'figlet';
import Table from 'cli-table3';

export const displayHeader = (): void => {
    
    const firstLine = figlet.textSync('Employee', { font: 'Standard' });
    const secondLine = figlet.textSync('Manager', { font: 'Standard' });

    
    const asciiArt = [...firstLine.split('\n'), ...secondLine.split('\n')];

    
    const maxLineLength = Math.max(...asciiArt.map((line) => line.length));

    
    const border = '+' + '-'.repeat(maxLineLength) + '+';

    
    console.log('\n' + border);
    asciiArt.forEach((line) => {
        console.log('|' + line.padEnd(maxLineLength, ' ') + '|');
    });
    console.log(border + '\n');
};

export const displayTable = (rows: any[], columnHeaders?: string[]): void => {

    const headers = columnHeaders || Object.keys(rows[0]);

    const table = new Table({
        head: headers,
        wordWrap: true,
        style: { head: ['cyan'], border: ['grey'] },
    });

    rows.forEach(row => {
        const rowData = headers.map(header => {
            const value = row[header];
            return value === null ? 'N/A' : value; 
        });
        table.push(rowData);
    });

    console.log(table.toString());
};
