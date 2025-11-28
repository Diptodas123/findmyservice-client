export function formatINR(value, opts = {}) {
    if (value === null || value === undefined || value === '') return '';

    const num = Number(value);
    if (Number.isNaN(num)) return String(value);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        currencyDisplay: 'symbol',
        minimumFractionDigits: typeof opts.minimumFractionDigits === 'number' ? opts.minimumFractionDigits : 2,
        maximumFractionDigits: typeof opts.maximumFractionDigits === 'number' ? opts.maximumFractionDigits : 2,
    });

    return formatter.format(num);
}

export default formatINR;
